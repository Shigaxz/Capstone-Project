# Back-end Reservas y Memorias CITT
Back-end construido utilizando TypeScript y NEST JS.
---
## Features(Hasta el momento)
* **Gestión de entidades:** CRUD completo para Lugares, Espacios y Memorias.
* **Registro de Usuarios:** Creación de adminitradores y utilizacion de bcrypt para hashear contraseñas.
* **Subida de Archivos a S3:** Integración con AWS S3 para el almacenamiento de imágenes de las memorias.
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
# AWS S3
AWS_ACCESS_KEY_ID=tu_id_de_clave_de_acceso_aws
AWS_SECRET_ACCESS_KEY=tu_clave_de_acceso_secreta_aws
AWS_REGION=tu_region_aws
AWS_S3_BUCKET_NAME=el_nombre_de_tu_bucket_s3
# Opcional: Solo si usas credenciales temporales (ej: AWS Academy)
AWS_SESSION_TOKEN=tu_token_de_sesion_temporal
```
---
## Base de datos
Dentro de la carpeta **`fase2/evidenciaProyecto`**, **`mongodb.txt`** posee las indicaciones para desplegar la base de datos MongoDB.
