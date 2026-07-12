# Design Document: waitlist-sqlite-storage

## Overview

Esta feature añade un módulo de almacenamiento SQLite local (`SQLite_Store`) al endpoint de waitlist existente en `app/api/waitlist/route.ts`. El objetivo es registrar de forma persistente cada email válido recibido en una base de datos `waitlist.db` local, actuando como respaldo independiente del servicio externo (`Upstream_Service`).

El diseño extiende el Route Handler existente con tres responsabilidades nuevas:

1. **Autenticación Bearer**: el token `WAITLIST_ENDPOINT_TOKEN` protege tanto las escrituras (POST) como las lecturas (GET).
2. **Almacenamiento local**: `SQLite_Store` persiste cada email antes de intentar el reenvío al upstream.
3. **Consulta de registros**: un nuevo handler GET permite recuperar todos los emails almacenados.

### Restricciones del entorno

- Next.js 16 con App Router corre en el runtime **Node.js** (no Edge). El Route Handler debe exportar `export const runtime = 'nodejs'` de forma explícita para garantizar que `better-sqlite3` (binding nativo) esté disponible.
- El proyecto usa **pnpm** como gestor de paquetes.
- No existe ningún framework de testing en el proyecto actualmente; se añadirán **vitest** y **fast-check** como dependencias de desarrollo.

---

## Architecture

El sistema sigue una arquitectura de capas simple, apropiada para un Route Handler de Next.js:

```
┌──────────────────────────────────────────────────────────┐
│               app/api/waitlist/route.ts                   │
│                  (Route Handler Layer)                    │
│                                                           │
│  POST /api/waitlist          GET /api/waitlist            │
│  ┌─────────────────┐         ┌─────────────────┐         │
│  │ 1. Auth check   │         │ 1. Auth check   │         │
│  │ 2. Validate body│         │ 2. getAllEmails()│         │
│  │ 3. insertEmail()│         │ 3. Return JSON  │         │
│  │ 4. Upstream fwd │         └─────────────────┘         │
│  └─────────────────┘                                      │
└──────────────────────────┬───────────────────────────────┘
                           │ import
┌──────────────────────────▼───────────────────────────────┐
│               lib/db/waitlist.ts                          │
│                  (SQLite_Store Layer)                     │
│                                                           │
│  - initDb()         → lazy singleton + DDL               │
│  - insertEmail()    → INSERT OR IGNORE                   │
│  - getAllEmails()   → SELECT ordered by created_at       │
└──────────────────────────┬───────────────────────────────┘
                           │ better-sqlite3
┌──────────────────────────▼───────────────────────────────┐
│                  waitlist.db (archivo SQLite)             │
│              (raíz del proyecto en runtime)              │
└──────────────────────────────────────────────────────────┘
```

### Decisiones de diseño clave

**`better-sqlite3` vs `node:sqlite` (experimental)**  
`better-sqlite3` es síncrono, maduro y no requiere configuración adicional de Node.js. La API síncrona simplifica el código del SQLite_Store y es apropiada para las bajas concurrencias esperadas en este tipo de endpoint. `node:sqlite` es experimental en Node.js 22 y no está garantizado en el entorno de Next.js 16.

**Singleton con lazy init**  
La conexión se inicializa en la primera llamada al módulo mediante un patrón singleton. Esto evita abrir/cerrar la conexión en cada request y es compatible con el modelo de proceso persistente de Next.js en producción.

**Inserción antes del reenvío upstream**  
SQLite_Store persiste el email antes de intentar el reenvío externo. Si el upstream falla, el email ya está guardado localmente. Esto cumple el Requisito 4.

**Autenticación en el Route Handler, no en SQLite_Store**  
La lógica de autenticación reside exclusivamente en el Route Handler. SQLite_Store es un módulo de datos puro que no toma decisiones de autorización.

**Ruta del archivo `waitlist.db`**  
Se usa `process.cwd()` para resolver la ruta en runtime. En producción con Next.js en un contenedor, `process.cwd()` apunta al directorio de trabajo del proceso (raíz del proyecto). Si el despliegue es en un entorno read-only (e.g., Vercel), el archivo debe almacenarse en `/tmp`; esto se puede controlar con una variable de entorno `WAITLIST_DB_PATH`.

---

## Components and Interfaces

### `lib/db/waitlist.ts` — SQLite_Store

```typescript
import Database from 'better-sqlite3'
import path from 'node:path'
import fs from 'node:fs'

export interface EmailEntry {
  id: number
  email: string
  created_at: string  // ISO 8601 UTC
  source: string | null
}

// Inicializa (o reutiliza) la conexión SQLite. 
// Retorna la instancia db con el esquema garantizado.
export function getDb(): Database.Database

// Inserta un email normalizado. INSERT OR IGNORE para duplicados.
// Retorna el id del registro insertado, o null si era duplicado.
export function insertEmail(email: string, source: string): number | null

// Retorna todos los registros ordenados por created_at ASC.
export function getAllEmails(): EmailEntry[]
```

**Contrato de `insertEmail`**:
- `email` ya llega normalizado (lowercase, trimmed) desde el Route Handler.
- `source` es el valor de `WAITLIST_SOURCE` o `"coming-soon"`.
- `created_at` lo genera el módulo con `new Date().toISOString()`.

### `app/api/waitlist/route.ts` — Route Handler (modificado)

Se añaden las siguientes responsabilidades al handler existente:

```typescript
// Segmento de configuración — necesario para binding nativo
export const runtime = 'nodejs'

// Función auxiliar de autenticación (reutilizada en POST y GET)
function checkAuth(request: Request): boolean

// POST modificado: añade auth check + insertEmail() antes del upstream
export async function POST(request: Request): Promise<Response>

// GET nuevo: auth check + getAllEmails()
export async function GET(request: Request): Promise<Response>
```

**Flujo POST actualizado**:

```
1. Validar Content-Type (existente)
2. Parsear body JSON (existente)
3. Validar email (existente)
4. [NUEVO] Verificar token Bearer → 401 si inválido
5. [NUEVO] insertEmail() → loguear error si falla, continuar
6. Verificar WAITLIST_ENDPOINT_URL → 200 si ausente (cambio: antes era 503)
7. Reenviar al upstream (existente, lógica sin cambios)
```

**Flujo GET nuevo**:

```
1. Verificar token Bearer → 401 si inválido
2. getAllEmails()
3. Retornar 200 con array JSON
```

### Función auxiliar `checkAuth`

```typescript
function checkAuth(request: Request): boolean {
  const token = process.env.WAITLIST_ENDPOINT_TOKEN?.trim()
  if (!token) return true  // Sin token configurado: acceso libre (Req. 3.3)
  const authHeader = request.headers.get('authorization')
  return authHeader === `Bearer ${token}`
}
```

---

## Data Models

### Tabla `waitlist_emails`

```sql
CREATE TABLE IF NOT EXISTS waitlist_emails (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  email      TEXT    NOT NULL UNIQUE,
  created_at TEXT    NOT NULL,
  source     TEXT
);
```

### Tipo `EmailEntry` (TypeScript)

```typescript
interface EmailEntry {
  id: number
  email: string       // normalizado: lowercase, trimmed
  created_at: string  // ISO 8601 UTC, e.g. "2025-01-15T10:30:00.000Z"
  source: string | null
}
```

### Respuesta GET `/api/waitlist`

```typescript
// HTTP 200
{ entries: EmailEntry[] }

// HTTP 401
{ error: "Unauthorized" }
```

### Respuesta POST `/api/waitlist` (sin cambios en formato)

```typescript
// HTTP 200
{ success: true, message: "Email added to waitlist" }

// HTTP 401 (nuevo)
{ error: "Unauthorized" }

// HTTP 400, 415, 502, 500 (sin cambios)
```

---

## Correctness Properties

*Una propiedad es una característica o comportamiento que debe ser cierto en todas las ejecuciones válidas del sistema — esencialmente, una declaración formal sobre lo que el sistema debe hacer. Las propiedades sirven de puente entre las especificaciones legibles por humanos y las garantías de corrección verificables por máquina.*

---

### Property 1: Idempotencia de la inicialización

*Para cualquier* base de datos SQLite en cualquier estado (recién creada, ya inicializada, con datos existentes), llamar a `initDb()` o `getDb()` N veces debe producir siempre el mismo esquema correcto sin errores y sin alterar registros existentes.

**Validates: Requirements 1.3**

---

### Property 2: Round-trip de inserción de email

*Para cualquier* email válido (string con formato de email, lowercase, trimmed), después de llamar a `insertEmail(email, source)`, una consulta a la base de datos debe retornar exactamente un registro con ese email, un `created_at` en formato ISO 8601 UTC, y el `source` correcto.

**Validates: Requirements 2.1**

---

### Property 3: Idempotencia de inserción (duplicados silenciosos)

*Para cualquier* email válido, insertar ese email dos o más veces debe resultar en exactamente un registro en la base de datos, sin lanzar errores en ninguna de las llamadas, y sin modificar el registro original.

**Validates: Requirements 2.2**

---

### Property 4: Rechazo de requests sin token válido (POST)

*Para cualquier* request POST con un email válido, si `WAITLIST_ENDPOINT_TOKEN` está configurado y el header `Authorization` no es exactamente `"Bearer <token>"` (incluyendo ausencia del header), el handler debe retornar HTTP 401 con `{"error": "Unauthorized"}`.

**Validates: Requirements 3.1, 3.2**

---

### Property 5: Almacenamiento garantizado antes del upstream

*Para cualquier* email válido con token correcto, cuando el upstream responde con éxito (2xx), el email debe estar presente en la base de datos SQLite Y la respuesta al cliente debe ser HTTP 200. Cuando el upstream responde con error (4xx/5xx), el email debe igualmente estar presente en SQLite Y la respuesta debe ser HTTP 502.

**Validates: Requirements 4.3, 4.4**

---

### Property 6: Almacenamiento sin upstream configurado

*Para cualquier* email válido con token correcto, cuando `WAITLIST_ENDPOINT_URL` no está configurado, el email debe insertarse en SQLite y la respuesta debe ser HTTP 200 con `{"success": true, "message": "Email added to waitlist"}`.

**Validates: Requirements 4.2**

---

### Property 7: GET retorna todos los emails ordenados

*Para cualquier* conjunto de N emails insertados en orden arbitrario, el endpoint GET (con token válido) debe retornar un array que contenga exactamente esos N emails ordenados por `created_at` de forma ascendente estricta.

**Validates: Requirements 5.1**

---

### Property 8: Rechazo de GET sin token válido

*Para cualquier* request GET con un header `Authorization` que no sea `"Bearer <token>"` (incluyendo ausencia del header), cuando el token está configurado, el handler debe retornar HTTP 401 con `{"error": "Unauthorized"}`.

**Validates: Requirements 5.2**

---

## Error Handling

### Errores en SQLite_Store

| Situación | Comportamiento |
|-----------|----------------|
| Error en `insertEmail()` distinto a UNIQUE constraint | `console.error` en servidor; el Route Handler continúa el flujo (no bloquea la respuesta al cliente) |
| Error en `getAllEmails()` | Propagar como excepción; el Route Handler la captura y retorna HTTP 500 |
| Fallo de apertura de `waitlist.db` (permisos, disco lleno) | La excepción burbujea al primer request que intente usar la DB; el Route Handler retorna HTTP 500 |

### Errores en el Route Handler (POST)

| Situación | HTTP | Body |
|-----------|------|------|
| Content-Type incorrecto | 415 | `{"error": "Unsupported Media Type"}` |
| JSON inválido | 400 | `{"error": "Invalid JSON"}` |
| Email inválido | 400 | `{"error": "Invalid email"}` |
| Token ausente o incorrecto | 401 | `{"error": "Unauthorized"}` |
| Error SQLite (no duplicado) | — | Se loguea; flujo continúa |
| WAITLIST_ENDPOINT_URL ausente | 200 | `{"success": true, "message": "Email added to waitlist"}` |
| Upstream rechaza la solicitud | 502 | `{"error": "Waitlist backend rejected submission"}` |
| Error inesperado | 500 | `{"error": "Internal Server Error"}` |

### Cambio de comportamiento respecto al código actual

El handler actual retorna **503** cuando `WAITLIST_ENDPOINT_URL` no está configurado. Con esta feature, ese caso retorna **200** porque el email ya ha sido guardado localmente (Requisito 4.2). Esta es una rotura intencional de comportamiento que debe documentarse en el changelog.

### Seguridad

- Los errores internos (traza de pila, nombre de columnas, ruta de archivo) **nunca** se exponen al cliente.
- El token se compara con igualdad estricta de cadena. No se usa `timingSafeEqual` porque el token es un secreto de configuración de servidor, no una credencial de usuario.
- El archivo `waitlist.db` debe añadirse a `.gitignore`.

---

## Testing Strategy

### Dependencias a instalar

```bash
pnpm add -D better-sqlite3 @types/better-sqlite3
pnpm add -D vitest @vitejs/plugin-react vite-tsconfig-paths
pnpm add -D fast-check
```

> `better-sqlite3` también se necesita como dependencia de producción:
> ```bash
> pnpm add better-sqlite3
> ```

### Configuración de Vitest

Crear `vitest.config.mts` en la raíz:

```typescript
import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: 'node',  // Sin DOM — son tests de lógica de servidor
    globals: true,
  },
})
```

Añadir a `package.json`:
```json
"scripts": {
  "test": "vitest --run"
}
```

### Estructura de tests

```
__tests__/
  lib/
    db/
      waitlist.test.ts      # Tests unitarios y property tests de SQLite_Store
  app/
    api/
      waitlist.test.ts      # Tests del Route Handler (con db en memoria)
```

### Estrategia de tests unitarios (SQLite_Store)

Los tests de `lib/db/waitlist.ts` usarán bases de datos SQLite **en memoria** (`:memory:`) para cada test suite, evitando I/O a disco y garantizando aislamiento total.

```typescript
// Ejemplo de configuración de test
import Database from 'better-sqlite3'
import { createStore } from '@/lib/db/waitlist'

let store: ReturnType<typeof createStore>

beforeEach(() => {
  const db = new Database(':memory:')
  store = createStore(db)  // Inyección de dependencia para testabilidad
})
```

> **Nota de diseño**: `lib/db/waitlist.ts` exporta tanto una función `createStore(db)` (para tests con DB en memoria) como el singleton `getDb()` para uso en producción. Esto permite inyección de dependencia sin complicar el API de producción.

### Tests de property-based con fast-check

Cada propiedad del diseño se implementa con **un único test de propiedad** usando `fc` (fast-check) con mínimo **100 iteraciones**. Los tests usan SQLite en memoria para eficiencia.

**Formato de tag**:
```typescript
// Feature: waitlist-sqlite-storage, Property N: <texto de la propiedad>
```

#### Property 1 — Idempotencia de inicialización

```typescript
// Feature: waitlist-sqlite-storage, Property 1: init idempotency
it('initDb is idempotent for any call count ≥ 1', () => {
  fc.assert(
    fc.property(fc.integer({ min: 2, max: 10 }), (n) => {
      const db = new Database(':memory:')
      const store = createStore(db)
      for (let i = 0; i < n; i++) store.init()
      const cols = db.prepare("PRAGMA table_info('waitlist_emails')").all()
      expect(cols.map((c: any) => c.name)).toEqual(
        expect.arrayContaining(['id', 'email', 'created_at', 'source'])
      )
    }),
    { numRuns: 100 }
  )
})
```

#### Property 2 — Round-trip de inserción

```typescript
// Feature: waitlist-sqlite-storage, Property 2: insert round-trip
it('inserted email is retrievable with correct fields', () => {
  fc.assert(
    fc.property(
      fc.emailAddress(),
      fc.string({ minLength: 1 }),
      (email, source) => {
        const db = new Database(':memory:')
        const store = createStore(db)
        store.init()
        store.insertEmail(email.toLowerCase().trim(), source)
        const rows = store.getAllEmails()
        const found = rows.find(r => r.email === email.toLowerCase().trim())
        expect(found).toBeDefined()
        expect(found!.source).toBe(source)
        expect(found!.created_at).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)
      }
    ),
    { numRuns: 100 }
  )
})
```

#### Property 3 — Idempotencia de inserción

```typescript
// Feature: waitlist-sqlite-storage, Property 3: duplicate insert idempotency
it('inserting the same email N times results in exactly 1 record', () => {
  fc.assert(
    fc.property(
      fc.emailAddress(),
      fc.integer({ min: 2, max: 10 }),
      (email, n) => {
        const db = new Database(':memory:')
        const store = createStore(db)
        store.init()
        const normalized = email.toLowerCase().trim()
        for (let i = 0; i < n; i++) {
          expect(() => store.insertEmail(normalized, 'test')).not.toThrow()
        }
        const rows = store.getAllEmails()
        expect(rows.filter(r => r.email === normalized)).toHaveLength(1)
      }
    ),
    { numRuns: 100 }
  )
})
```

#### Property 4 — Rechazo de token inválido (POST)

```typescript
// Feature: waitlist-sqlite-storage, Property 4: invalid token rejected on POST
it('POST with invalid or absent Authorization is always 401', async () => {
  process.env.WAITLIST_ENDPOINT_TOKEN = 'secret-token'
  await fc.assert(
    fc.asyncProperty(
      fc.emailAddress(),
      fc.option(fc.string().filter(s => s !== 'Bearer secret-token'), { nil: undefined }),
      async (email, authHeader) => {
        const request = new Request('http://localhost/api/waitlist', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(authHeader ? { Authorization: authHeader } : {}),
          },
          body: JSON.stringify({ email }),
        })
        const response = await POST(request)
        expect(response.status).toBe(401)
      }
    ),
    { numRuns: 100 }
  )
})
```

#### Property 5 — Almacenamiento garantizado ante cualquier respuesta del upstream

```typescript
// Feature: waitlist-sqlite-storage, Property 5: SQLite always written regardless of upstream outcome
it('email is in SQLite for both upstream success and failure', async () => {
  await fc.assert(
    fc.asyncProperty(
      fc.emailAddress(),
      fc.boolean(), // true = upstream success, false = upstream error
      async (email, upstreamSucceeds) => {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue(
          new Response(null, { status: upstreamSucceeds ? 200 : 500 })
        ))
        // ... llamar POST con mock db en memoria y verificar
      }
    ),
    { numRuns: 100 }
  )
})
```

#### Property 6 — Almacenamiento sin upstream configurado

```typescript
// Feature: waitlist-sqlite-storage, Property 6: store without upstream returns 200
it('POST without WAITLIST_ENDPOINT_URL stores email and returns 200', async () => {
  delete process.env.WAITLIST_ENDPOINT_URL
  await fc.assert(
    fc.asyncProperty(fc.emailAddress(), async (email) => {
      // llamar POST con token válido, sin URL upstream
      // verificar HTTP 200 y presencia en SQLite
    }),
    { numRuns: 100 }
  )
})
```

#### Property 7 — GET retorna todos los emails ordenados

```typescript
// Feature: waitlist-sqlite-storage, Property 7: GET returns all emails sorted by created_at ASC
it('GET returns all inserted emails ordered by created_at ascending', async () => {
  await fc.assert(
    fc.asyncProperty(
      fc.array(fc.emailAddress(), { minLength: 1, maxLength: 20 }),
      async (emails) => {
        // Insertar emails con timestamps escalonados, llamar GET,
        // verificar que están todos y en orden ascendente
      }
    ),
    { numRuns: 100 }
  )
})
```

#### Property 8 — Rechazo de GET con token inválido

```typescript
// Feature: waitlist-sqlite-storage, Property 8: invalid token rejected on GET
it('GET with invalid or absent Authorization is always 401', async () => {
  process.env.WAITLIST_ENDPOINT_TOKEN = 'secret-token'
  await fc.assert(
    fc.asyncProperty(
      fc.option(fc.string().filter(s => s !== 'Bearer secret-token'), { nil: undefined }),
      async (authHeader) => {
        const request = new Request('http://localhost/api/waitlist', {
          method: 'GET',
          headers: authHeader ? { Authorization: authHeader } : {},
        })
        const response = await GET(request)
        expect(response.status).toBe(401)
      }
    ),
    { numRuns: 100 }
  )
})
```

### Tests de ejemplo (no property)

Los siguientes casos se implementan como tests de ejemplo unitarios:

- **2.3**: Mock de DB que lanza error → verificar que el handler loguea y continúa.
- **3.3**: Sin `WAITLIST_ENDPOINT_TOKEN` configurado → verificar que el request sin `Authorization` se procesa.
- **4.1**: Verificar que `insertEmail` se llama antes que `fetch` usando spies.
- **5.3**: DB vacía → GET retorna `[]`.

### Tests de smoke (integración)

Ejecutados solo en CI con acceso a disco, no en la suite unit:

- **1.1 / 1.2**: `initDb()` crea `waitlist.db` con el esquema correcto en disco real.
- **2.4**: Medir latencia de una inserción típica (debe ser < 500ms).
- **5.4**: Medir latencia de `getAllEmails()` con 100.000 registros (debe ser < 500ms).
