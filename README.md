# cityspot-platform

Desarrollamos CitySpot como una plataforma web para descubrir actividades y lugares turisticos en Ecuador.

Autoras:

```txt
Dayana Castillo y Geovanna Velasco
```

## API backend

El backend esta en:

```txt
cityspot_api/
```

Base URL local:

```txt
http://localhost:3000/api
```

## Frontend admin

El frontend esta en:

```txt
cityspot_web/
```

Levantarlo:

```bash
cd cityspot_web
npm install
npm run dev
```

URL local:

```txt
http://localhost:5173
```

El panel administrador usa menu lateral y esta en:

```txt
/admin
```

El login esta en:

```txt
/login
```

Para conectar con la API, crear `cityspot_web/.env` usando como base `.env.example`:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

Health check:

```txt
GET http://localhost:3000/health
```

## Como levantar el servicio

1. Entrar a la carpeta del backend:

```bash
cd cityspot_api
```

2. Instalar dependencias:

```bash
npm install
```

3. Crear `cityspot_api/.env` usando como base:

```txt
cityspot_api/.env.example
```

En ese archivo configuramos las conexiones a PostgreSQL, MongoDB y JWT.

Para subir imagenes tambien debe tener:

```txt
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
SUPABASE_BUCKET=activity-images
```

Para recomendaciones con IA tambien debe tener:

```txt
OPENAI_API_KEY
OPENAI_MODEL=gpt-4o-mini
```

4. Levantar PostgreSQL y MongoDB.

5. Ejecutar el script SQL:

```txt
cityspot_db/cityspot_db.sql
```

6. Iniciar API:

```bash
npm run dev
```

Si todo esta bien, debe responder:

```txt
GET http://localhost:3000/health
```

## Postman

La coleccion esta en:

```txt
cityspot_api/docs/cityspot_api_platform.postman_collection.json
```

Importarla en Postman y revisar las variables de la coleccion:

```txt
rootUrl       = http://localhost:3000
baseUrl       = http://localhost:3000/api
userEmail     = correo del usuario de prueba
userPassword  = clave del usuario de prueba
userToken     = token JWT del usuario
adminEmail    = correo del administrador
adminPassword = clave del administrador
adminToken    = token JWT del administrador
categoryId    = id de categoria para consultar/editar/eliminar
```

Despues de hacer login, copiar el `token` de la respuesta y pegarlo en `userToken` o `adminToken`.

## Modulos disponibles

### Users

Maneja registro, login, perfil y desactivacion logica del usuario.

Endpoints:

```txt
POST   /api/users/register
POST   /api/users/login
GET    /api/users/profile
PATCH  /api/users/profile
DELETE /api/users/profile
```

Para consumir rutas protegidas desde frontend, enviar:

```txt
Authorization: Bearer TOKEN
```

### Categories

Maneja categorias de actividades turisticas.

Endpoints:

```txt
GET    /api/categories
GET    /api/categories/:id
POST   /api/categories
PATCH  /api/categories/:id
DELETE /api/categories/:id
```

Uso recomendado en frontend:

- `GET /api/categories`: llenar selects, filtros y formularios.
- `GET /api/categories/:id`: ver detalle de una categoria.
- `POST`, `PATCH`, `DELETE`: solo administradores.

### Activities

Maneja actividades turisticas creadas por propietarios.

Endpoints:

```txt
GET    /api/activities
GET    /api/activities?city=Quito
GET    /api/activities?categoryId=1
GET    /api/activities/:id
GET    /api/activities/mine
POST   /api/activities
PATCH  /api/activities/:id
PATCH  /api/activities/:id/status
DELETE /api/activities/:id
```

Uso recomendado en frontend:

- `GET /api/activities`: mostrar actividades publicas activas.
- `GET /api/activities/mine`: mostrar actividades del propietario autenticado.
- `POST /api/activities`: solo propietarios.
- `PATCH /api/activities/:id`: solo el propietario de la actividad.
- `PATCH /api/activities/:id/status`: solo administradores.
- `DELETE /api/activities/:id`: desactiva la actividad.

### Images

Maneja imagenes de actividades. El archivo real se sube a Supabase Storage y en PostgreSQL se guarda la URL.

Endpoints:

```txt
GET    /api/activities/:activityId/images
POST   /api/activities/:activityId/images
PATCH  /api/activities/:activityId/images/:imageId/main
DELETE /api/activities/:activityId/images/:imageId
```

Uso recomendado en frontend:

- `GET`: listar imagenes de una actividad.
- `POST`: subir imagen con `multipart/form-data`, campo `image`.
- `PATCH /main`: marcar una imagen como principal.
- `DELETE`: eliminar imagen de Supabase y PostgreSQL.

Campos para subir imagen:

```txt
image       -> archivo jpg, png o webp
description -> texto opcional
isMain      -> true o false
```

### Favorites

Maneja las actividades guardadas por usuarios turistas.

Endpoints:

```txt
GET    /api/favorites
POST   /api/favorites/:activityId
DELETE /api/favorites/:activityId
```

Uso recomendado en frontend:

- `GET`: listar favoritos del usuario autenticado.
- `POST`: guardar una actividad activa como favorita.
- `DELETE`: quitar una actividad de favoritos.

Reglas:

- Solo el rol `USUARIO` puede guardar favoritos.
- No se puede guardar dos veces la misma actividad.
- Solo se pueden guardar actividades con estado `ACTIVA`.

### Search History

Maneja el historial de busquedas del usuario turista. Este modulo usa MongoDB.

Endpoints:

```txt
GET    /api/search-history
POST   /api/search-history
DELETE /api/search-history
DELETE /api/search-history/:id
```

Uso recomendado en frontend:

- `POST`: guardar una busqueda realizada por el usuario.
- `GET`: mostrar las ultimas busquedas del usuario.
- `DELETE /:id`: borrar una busqueda especifica.
- `DELETE /`: limpiar todo el historial del usuario.

Campos principales:

```txt
city
company
budget
activityType
```

Reglas:

- Solo el rol `USUARIO` puede guardar historial.
- El usuario solo ve y elimina su propio historial.
- Se exige al menos un criterio de busqueda.

### Recommendations

Maneja recomendaciones con IA para usuarios turistas. Nosotros consultamos actividades activas en PostgreSQL, enviamos esas opciones a OpenAI y guardamos en MongoDB solamente la busqueda que genero una recomendacion correcta.

Endpoint:

```txt
POST /api/recommendations
```

Uso recomendado en frontend:

- Enviar preferencias del usuario para recibir actividades recomendadas.
- Mostrar la explicacion que devuelve la IA en cada actividad.
- Usar este endpoint solo con usuarios autenticados de rol `USUARIO`.

Campos principales:

```txt
city
company
budget
activityType
```

Reglas:

- La IA no inventa actividades; solo recomienda actividades reales de PostgreSQL.
- La clave `OPENAI_API_KEY` solo va en el backend.
- Si la IA responde correctamente, guardamos la busqueda en MongoDB.

## Respuestas y errores comunes

```txt
200 OK      -> solicitud correcta
201 Created -> recurso creado
400 Bad Request -> datos invalidos
401 Unauthorized -> falta token o token invalido
403 Forbidden -> usuario sin permiso o inactivo
404 Not Found -> recurso no existe
409 Conflict -> duplicado o recurso relacionado
500 Internal Server Error -> error interno
```

## Nota para frontend

Por ahora el frontend puede trabajar con:

```txt
Users      -> autenticacion y perfil
Categories -> listado de categorias para formularios/filtros
Activities -> actividades turisticas creadas por propietarios
Images     -> imagenes de actividades guardadas en Supabase Storage
Favorites  -> actividades guardadas por usuarios
Search History -> historial de busquedas guardado en MongoDB
Recommendations -> recomendaciones con IA usando OpenAI
```
