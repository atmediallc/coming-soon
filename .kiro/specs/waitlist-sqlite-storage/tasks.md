# Implementation Plan: waitlist-sqlite-storage

## Overview

Añadir almacenamiento persistente SQLite al endpoint de waitlist existente. La implementación se divide en tres bloques: configuración del entorno de testing, creación del módulo `SQLite_Store` en `lib/db/waitlist.ts`, y modificación del Route Handler en `app/api/waitlist/route.ts` para añadir autenticación Bearer, persistencia local y el nuevo handler GET.

## Tasks

- [-] 1. Configurar dependencias y entorno de testing
  - Instalar `better-sqlite3` (producción) y sus tipos: `pnpm add better-sqlite3` y `pnpm add -D @types/better-sqlite3`
  - Instalar Vitest y plugins: `pnpm add -D vitest @vitejs/plugin-react vite-tsconfig-paths`
  - Instalar fast-check: `pnpm add -D fast-check`
  - Crear `vitest.config.mts` en la raíz con `environment: 'node'` y `globals: true`, usando `vite-tsconfig-paths` para resolver alias `@/`
  - Añadir script `"test": "vitest --run"` en `package.json`
  - Añadir `waitlist.db` a `.gitignore`
  - _Requirements: 1.1_

- [ ] 2. Implementar el módulo SQLite_Store (`lib/db/waitlist.ts`)
  - [~] 2.1 Crear `lib/db/waitlist.ts` con la interfaz `EmailEntry`, la función `createStore(db)` para inyección de dependencia en tests, y el singleton `getDb()` para uso en producción
    - `EmailEntry`: `{ id: number, email: string, created_at: string, source: string | null }`
    - `createStore(db)` expone `init()`, `insertEmail(email, source)`, `getAllEmails()`
    - `getDb()` abre `waitlist.db` usando `process.cwd()` (o `WAITLIST_DB_PATH` si está configurado) y llama `init()` una sola vez (patrón singleton)
    - DDL: `CREATE TABLE IF NOT EXISTS waitlist_emails (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT NOT NULL UNIQUE, created_at TEXT NOT NULL, source TEXT)`
    - `insertEmail`: usa `INSERT OR IGNORE`, genera `created_at` con `new Date().toISOString()`, retorna el `id` del registro o `null` si era duplicado
    - `getAllEmails`: `SELECT * FROM waitlist_emails ORDER BY created_at ASC`
    - _Requirements: 1.1, 1.2, 1.3, 2.1, 2.2, 2.4, 5.1, 5.4_

  - [ ]* 2.2 Escribir property test — Property 1: Idempotencia de inicialización
    - Archivo: `__tests__/lib/db/waitlist.test.ts`
    - **Property 1: Init idempotency**
    - Genera `n` aleatorio entre 2 y 10; llama `store.init()` N veces sobre una DB en memoria; verifica que el esquema contiene las columnas `id`, `email`, `created_at`, `source`
    - Tag: `// Feature: waitlist-sqlite-storage, Property 1: init idempotency`
    - **Validates: Requirements 1.3**

  - [ ]* 2.3 Escribir property test — Property 2: Round-trip de inserción
    - **Property 2: Insert round-trip**
    - Genera email y source arbitrarios; inserta; llama `getAllEmails()`; verifica que el registro existe con email normalizado, source correcto y `created_at` con formato ISO 8601
    - Tag: `// Feature: waitlist-sqlite-storage, Property 2: insert round-trip`
    - **Validates: Requirements 2.1**

  - [ ]* 2.4 Escribir property test — Property 3: Idempotencia de inserción (duplicados silenciosos)
    - **Property 3: Duplicate insert idempotency**
    - Genera email y `n` entre 2 y 10; inserta el mismo email N veces; verifica que no se lanza ningún error y que existe exactamente 1 registro
    - Tag: `// Feature: waitlist-sqlite-storage, Property 3: duplicate insert idempotency`
    - **Validates: Requirements 2.2**

  - [ ]* 2.5 Escribir test de ejemplo — error de DB no duplicado
    - Mock de `db.prepare().run()` que lanza un error distinto a UNIQUE constraint
    - Verificar que `insertEmail` no relanza la excepción (o que el Route Handler la absorbe) y que el flujo continúa
    - _Requirements: 2.3_

- [~] 3. Checkpoint — Verificar SQLite_Store
  - Ejecutar `pnpm test` y asegurarse de que todos los tests del SQLite_Store pasan. Preguntar al usuario si hay dudas antes de continuar.

- [ ] 4. Modificar el Route Handler (`app/api/waitlist/route.ts`)
  - [~] 4.1 Añadir `export const runtime = 'nodejs'` al inicio del archivo para garantizar el binding nativo de `better-sqlite3`
    - _Requirements: 1.1_

  - [~] 4.2 Implementar la función auxiliar `checkAuth(request: Request): boolean`
    - Si `WAITLIST_ENDPOINT_TOKEN` no está configurado, retorna `true` (acceso libre)
    - Si está configurado, compara `request.headers.get('authorization')` con `"Bearer <token>"` usando igualdad estricta
    - _Requirements: 3.1, 3.2, 3.3_

  - [~] 4.3 Actualizar el handler `POST` para añadir autenticación y persistencia SQLite
    - Insertar verificación `checkAuth` justo después de la validación del email (antes del acceso a `WAITLIST_ENDPOINT_URL`); retornar 401 `{"error": "Unauthorized"}` si falla
    - Llamar `insertEmail()` importado desde `lib/db/waitlist.ts` antes de hacer `fetch` al upstream; envolver en try/catch y loguear con `console.error` sin bloquear el flujo
    - Cambiar el caso `!waitlistEndpoint`: en lugar de retornar 503, retornar 200 `{"success": true, "message": "Email added to waitlist"}`
    - _Requirements: 2.1, 3.1, 3.2, 3.3, 4.1, 4.2_

  - [~] 4.4 Implementar el handler `GET` para consulta de emails
    - Verificar `checkAuth`; retornar 401 si falla
    - Llamar `getAllEmails()` importado desde `lib/db/waitlist.ts`
    - Retornar 200 con `{ entries: EmailEntry[] }`; manejar errores con try/catch retornando 500
    - _Requirements: 5.1, 5.2, 5.3_

  - [ ]* 4.5 Escribir property test — Property 4: Rechazo de token inválido en POST
    - Archivo: `__tests__/app/api/waitlist.test.ts`
    - **Property 4: Invalid token rejected on POST**
    - Configura `WAITLIST_ENDPOINT_TOKEN = 'secret-token'`; genera emails y headers de Authorization arbitrarios que no sean `"Bearer secret-token"`; verifica que `POST` retorna siempre 401
    - Tag: `// Feature: waitlist-sqlite-storage, Property 4: invalid token rejected on POST`
    - Usar `createStore` con DB en memoria para aislar el test del filesystem
    - **Validates: Requirements 3.1, 3.2**

  - [ ]* 4.6 Escribir property test — Property 5: Almacenamiento garantizado ante cualquier respuesta del upstream
    - **Property 5: SQLite always written regardless of upstream outcome**
    - Genera emails y un booleano `upstreamSucceeds`; stub de `fetch` global que retorna 200 o 500; verifica que el email está en SQLite en ambos casos, y que la respuesta HTTP es 200 (éxito) o 502 (error upstream)
    - Tag: `// Feature: waitlist-sqlite-storage, Property 5: SQLite always written regardless of upstream outcome`
    - **Validates: Requirements 4.3, 4.4**

  - [ ]* 4.7 Escribir property test — Property 6: Almacenamiento sin upstream configurado
    - **Property 6: Store without upstream returns 200**
    - Elimina `WAITLIST_ENDPOINT_URL` del entorno; genera emails con token válido; verifica HTTP 200 y presencia del email en SQLite
    - Tag: `// Feature: waitlist-sqlite-storage, Property 6: store without upstream returns 200`
    - **Validates: Requirements 4.2**

  - [ ]* 4.8 Escribir property test — Property 7: GET retorna todos los emails ordenados
    - **Property 7: GET returns all emails sorted by created_at ASC**
    - Genera arrays de entre 1 y 20 emails; inserta cada uno con timestamps escalonados (inyectando `created_at` manualmente vía SQL directo para controlar el orden); llama al handler GET; verifica que el array contiene exactamente los N emails y que `created_at` es estrictamente creciente
    - Tag: `// Feature: waitlist-sqlite-storage, Property 7: GET returns all emails sorted by created_at ASC`
    - **Validates: Requirements 5.1**

  - [ ]* 4.9 Escribir property test — Property 8: Rechazo de GET con token inválido
    - **Property 8: Invalid token rejected on GET**
    - Configura `WAITLIST_ENDPOINT_TOKEN = 'secret-token'`; genera headers de Authorization arbitrarios que no sean `"Bearer secret-token"`; verifica que `GET` retorna siempre 401
    - Tag: `// Feature: waitlist-sqlite-storage, Property 8: invalid token rejected on GET`
    - **Validates: Requirements 5.2**

  - [ ]* 4.10 Escribir test de ejemplo — sin `WAITLIST_ENDPOINT_TOKEN` configurado
    - Elimina la variable de entorno; envía POST sin `Authorization`; verifica que se procesa normalmente (no retorna 401)
    - _Requirements: 3.3_

  - [ ]* 4.11 Escribir test de ejemplo — GET con tabla vacía
    - DB en memoria vacía (solo `init()`); llama al handler GET con token válido; verifica HTTP 200 con `{ entries: [] }`
    - _Requirements: 5.3_

  - [ ]* 4.12 Escribir test de ejemplo — `insertEmail` se llama antes que `fetch`
    - Usar spies de Vitest (`vi.spyOn`) para verificar el orden de ejecución: `insertEmail` debe haber sido llamado antes de que `fetch` sea invocado
    - _Requirements: 4.1_

- [~] 5. Checkpoint final — Todos los tests pasan
  - Ejecutar `pnpm test` y asegurarse de que la suite completa pasa sin errores. Preguntar al usuario si hay dudas antes de finalizar.

## Notes

- Las tareas marcadas con `*` son opcionales y pueden omitirse para un MVP más rápido
- El diseño exige que `lib/db/waitlist.ts` exporte `createStore(db)` además del singleton `getDb()`, para permitir inyección de dependencia en todos los tests de Route Handler
- `better-sqlite3` es síncrono; no usar `await` en las llamadas al store
- Los tests de Route Handler deben importar `POST` y `GET` directamente desde el módulo; usar `vi.stubEnv` o asignación directa a `process.env` para controlar variables de entorno, con limpieza en `afterEach`
- El cambio de 503 → 200 cuando `WAITLIST_ENDPOINT_URL` no está configurado es un breaking change intencional documentado en el diseño
- El archivo `waitlist.db` nunca debe comitearse; verificar que está en `.gitignore` como parte de la tarea 1
- Consultar `node_modules/next/dist/docs/` antes de modificar el Route Handler para verificar convenciones actuales de Next.js 16

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1"] },
    { "id": 1, "tasks": ["2.1"] },
    { "id": 2, "tasks": ["2.2", "2.3", "2.4", "2.5", "4.1"] },
    { "id": 3, "tasks": ["4.2"] },
    { "id": 4, "tasks": ["4.3", "4.4"] },
    { "id": 5, "tasks": ["4.5", "4.6", "4.7", "4.8", "4.9", "4.10", "4.11", "4.12"] }
  ]
}
```
