# Requirements Document

## Introduction

Esta feature añade almacenamiento local persistente en SQLite para los emails recibidos en el endpoint de waitlist de la aplicación coming-soon de TraderAdd. Actualmente el endpoint reenvía las solicitudes a un servicio externo configurado mediante `WAITLIST_ENDPOINT_URL`. El objetivo es almacenar cada email recibido en una base de datos SQLite local como mecanismo de respaldo y registro local, independientemente del resultado del reenvío al servicio externo. El acceso de escritura al endpoint estará protegido por el token `WAITLIST_ENDPOINT_TOKEN`.

## Glossary

- **Waitlist_API**: El Route Handler de Next.js ubicado en `app/api/waitlist/route.ts` que recibe solicitudes POST con emails de usuarios.
- **SQLite_Store**: El módulo de acceso a datos encargado de abrir, inicializar y operar sobre la base de datos SQLite local.
- **Database**: El archivo SQLite local (`waitlist.db`) almacenado en el sistema de archivos del servidor.
- **Email_Entry**: Un registro en la base de datos compuesto por un email normalizado, una marca de tiempo de inserción y un identificador único.
- **Token**: El valor de la variable de entorno `WAITLIST_ENDPOINT_TOKEN` usado para autenticar solicitudes de escritura al endpoint.
- **Upstream_Service**: El servicio externo opcional configurado mediante `WAITLIST_ENDPOINT_URL` al que el endpoint reenvía los emails.

## Requirements

### Requirement 1: Inicialización de la base de datos

**User Story:** Como operador del sistema, quiero que la base de datos SQLite se inicialice automáticamente al arrancar, para no tener que crear manualmente el esquema antes de recibir solicitudes.

#### Acceptance Criteria

1. WHEN el servidor recibe la primera solicitud al endpoint de waitlist, THE SQLite_Store SHALL crear el archivo `waitlist.db` en el directorio raíz del proyecto si no existe.
2. WHEN el SQLite_Store se inicializa, THE SQLite_Store SHALL crear la tabla `waitlist_emails` con las columnas `id` (INTEGER PRIMARY KEY AUTOINCREMENT), `email` (TEXT NOT NULL UNIQUE), `created_at` (TEXT NOT NULL) y `source` (TEXT) si la tabla no existe.
3. WHEN la tabla `waitlist_emails` ya existe, THE SQLite_Store SHALL omitir la creación y continuar sin error.

---

### Requirement 2: Almacenamiento de emails en SQLite

**User Story:** Como operador del sistema, quiero que cada email válido recibido quede registrado en la base de datos SQLite local, para tener un registro persistente de la lista de espera independiente del servicio externo.

#### Acceptance Criteria

1. WHEN el Waitlist_API recibe un POST con un email válido y autenticado, THE SQLite_Store SHALL insertar un Email_Entry con el email normalizado (trimmed, lowercase), la marca de tiempo UTC en formato ISO 8601 y la fuente (`WAITLIST_SOURCE` o `"coming-soon"`).
2. WHEN se intenta insertar un email que ya existe en la base de datos, THE SQLite_Store SHALL ignorar el duplicado sin retornar error al cliente (INSERT OR IGNORE).
3. WHEN la inserción en SQLite falla por un motivo distinto a duplicado, THE Waitlist_API SHALL registrar el error en el log del servidor y continuar el flujo de respuesta sin exponer detalles del error al cliente.
4. THE SQLite_Store SHALL completar cada operación de escritura en menos de 500ms bajo condiciones normales de operación.

---

### Requirement 3: Autenticación del endpoint

**User Story:** Como operador del sistema, quiero que el endpoint de waitlist requiera un token de autorización válido, para que solo los clientes autorizados puedan registrar emails.

#### Acceptance Criteria

1. WHEN el Waitlist_API recibe una solicitud POST sin cabecera `Authorization`, THE Waitlist_API SHALL retornar HTTP 401 con cuerpo `{"error": "Unauthorized"}`.
2. WHEN el Waitlist_API recibe una solicitud POST con una cabecera `Authorization` cuyo valor no coincide con `Bearer <WAITLIST_ENDPOINT_TOKEN>`, THE Waitlist_API SHALL retornar HTTP 401 con cuerpo `{"error": "Unauthorized"}`.
3. WHEN la variable de entorno `WAITLIST_ENDPOINT_TOKEN` no está configurada, THE Waitlist_API SHALL omitir la validación del token y procesar la solicitud normalmente.
4. WHEN el Waitlist_API recibe una solicitud POST con token válido y email válido, THE Waitlist_API SHALL proceder con el almacenamiento y retornar HTTP 200.

---

### Requirement 4: Coexistencia con el reenvío al servicio externo

**User Story:** Como operador del sistema, quiero que el almacenamiento en SQLite ocurra independientemente del estado del servicio externo, para no perder registros cuando el upstream no está disponible.

#### Acceptance Criteria

1. WHEN el Waitlist_API recibe un email válido, THE Waitlist_API SHALL intentar la inserción en SQLite antes de reenviar al Upstream_Service.
2. WHEN el Upstream_Service no está configurado (`WAITLIST_ENDPOINT_URL` ausente), THE Waitlist_API SHALL almacenar el email en SQLite y retornar HTTP 200 con `{"success": true, "message": "Email added to waitlist"}`.
3. WHEN el Upstream_Service retorna un error, THE Waitlist_API SHALL haber almacenado el email en SQLite y retornar HTTP 502 al cliente.
4. WHEN el Upstream_Service retorna éxito, THE Waitlist_API SHALL haber almacenado el email en SQLite y retornar HTTP 200 al cliente.

---

### Requirement 5: Consulta de emails almacenados

**User Story:** Como operador del sistema, quiero poder recuperar la lista de emails registrados en la base de datos, para poder exportarlos o revisarlos sin acceso directo al archivo SQLite.

#### Acceptance Criteria

1. WHEN el Waitlist_API recibe una solicitud GET con una cabecera `Authorization` válida, THE Waitlist_API SHALL retornar HTTP 200 con un array JSON de Email_Entry ordenado por `created_at` ascendente.
2. WHEN el Waitlist_API recibe una solicitud GET sin cabecera `Authorization` válida, THE Waitlist_API SHALL retornar HTTP 401 con cuerpo `{"error": "Unauthorized"}`.
3. WHEN la tabla `waitlist_emails` no contiene registros, THE Waitlist_API SHALL retornar HTTP 200 con un array JSON vacío.
4. THE SQLite_Store SHALL completar cada operación de lectura en menos de 500ms para hasta 100.000 registros.
