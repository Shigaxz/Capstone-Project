# Back-end Reservas y Memorias CITT
Back-end construido utilizando TypeScript y NEST JS.
---
## Features(Hasta el momento)
* **Gestión de entidades:** CRUD completo para Lugares, Espacios y Memorias.
* **Registro de Usuarios:** Creación de adminitradores y utilizacion de bcrypt para hashear contraseñas.
* **Notificaciones por Correo:** Envío automático de emails (usando SMTP) al aprobar o rechazar reservas..
* **Autenticación JWT:** Inicio de sesión que genera un JWT para autenticar solicitudes.
* **Documentación Automatizada:** API documentada de forma interactiva con Swagger (OpenAPI).
* **Base de Datos:** MongoDB.
---
## Documentación de la API
Para poder documentar y probar los endpoints de la API, el proyecto utiliza Swagger (OpenAPI). La documentación se genera automáticamente a partir del código del backend.

Una vez que el servidor esté en ejecución, puedes acceder a la documentación interactiva en tu navegador a través de la siguiente ruta:
`http://localhost:3000/api-docs`

## Configuracion de las variables de entorno
Crea el archivo `.env` en la raíz del proyecto, ejemplo de las variables utilizadas.
```ini
# Base de Datos (MongoDB)
MONGO_URL=mongodb://tu_url_de_conexion
# Autenticación JWT
JWT_SECRET=tu_clave_secreta_para_jwt
# API Key
API_KEY=tu_api_key_personalizada
# Servidor de Correo (SMTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=465
EMAIL_USER=tu_correo@gmail.com
EMAIL_PASS=tu_contraseña_de_aplicacion
```
---
## Base de datos
Dentro de la carpeta **`fase2/evidenciaProyecto`**, **`mongodb.txt`** posee la descripción de las colecciones y la estructura de datos utilizada en la base de datos.
