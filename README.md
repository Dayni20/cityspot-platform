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
```

Los modulos de actividades, imagenes, favoritos, historial y recomendaciones se agregaran despues.
