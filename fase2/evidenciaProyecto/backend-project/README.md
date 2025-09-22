# Back-end Reservas y Memorias CITT
Back-end construido utilizando TypeScript y NEST JS.
---
## Features(Hasta el momento)
* **Registro de Usuarios:** Creación de adminitradores y utilizacion de bcrypt para hashear contraseñas.
* **Autenticación JWT:** Inicio de sesión que genera un JWT para autenticar solicitudes.
* * **Base de Datos:** MongoDB.
---
## Documentación de la API
| Endpoint             | Método | Descripción                                              | Body                                                        | Requiere x-api-key|
| -------------------- | ------ | -------------------------------------------------------- | ----------------------------------------------------------- | ----------------  |
| `/api/admin/register`| `POST` | Registra un nuevo administrador.                         | `{"user": "...","email": "...", "password": "...",}`        | Si                |
| `/api/admin/login`   | `POST` | Inicia sesión y obtiene el token JWT.                    | `{"email": "...", "password": "..."}`                       | Si                |
---
## Configuracion de las variables de entorno
Crea el archivo `.env` en la raíz del proyecto, ejemplo de las variables utilizadas.
```ini
# Base de Datos
MONGO_URL=MONGO_URL
# JWT
JWT_SECRET=CLAVE_JWT
# API-KEY
API-KEY= API-KEY
```
---
## Base de datos
Dentro de la carpeta **`fase2/evidenciaProyecto`**, **`mongodb.txt`** posee las indicaciones para desplegar la base de datos MongoDB.
