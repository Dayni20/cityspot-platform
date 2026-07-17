# cityspot-platform

Plataforma web para descubrir actividades y lugares turisticos en Ecuador.

## API backend

El backend esta en:

```txt
cityspot_api/
```

Base URL local:

```txt
http://localhost:3000/api
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

3. Verificar que exista `cityspot_api/.env` con las conexiones a PostgreSQL, MongoDB y JWT.

Para subir imagenes tambien debe tener:

```txt
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
SUPABASE_BUCKET=activity-images
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
cityspot_api/docs/cityspot_api.postman_collection.json
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
```

Los modulos de favoritos, historial y recomendaciones se agregaran despues.
