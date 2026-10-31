# Fitcor - Aplicación de Gimnasio

Aplicación web de gimnasio con frontend en React y backend en Node.js/Express sobre MongoDB Atlas: login de usuarios y gestión de rutinas de entrenamiento (crear, listar, editar y borrar).

- **Web**: https://www.fitcor.fun
- **API**: https://api.fitcor.fun

## Usuarios de prueba

Credenciales para iniciar sesión en https://www.fitcor.fun:

| Email | Contraseña |
|---|---|
| evaluador1@fitcor.fun | Fitcor2026! |
| evaluador2@fitcor.fun | Fitcor2026! |
| evaluador3@fitcor.fun | Fitcor2026! |

## Características

- **Frontend React** con navegación por rutas (React Router) y carga diferida de páginas (`lazy` + `Suspense`)
- **Backend Express** con autenticación JWT, controladores separados de las rutas, Helmet, Morgan y CORS restringido
- **MongoDB Atlas** mediante Mongoose, con filtro de búsqueda por nombre (`$regex`)
- **CRUD completo** de rutinas
- **Diseño responsive** para móvil, tablet y escritorio
- **Estado de autenticación global** con Context API y hooks personalizados
- **Modales y toasts** en lugar de `alert()`
- **Logging solo en desarrollo** en el frontend

## Requisitos previos

- Node.js 18 o superior
- npm
- Una base de datos en MongoDB Atlas

## Instalación

### 1. Instalar dependencias

```bash
# Frontend (raíz del proyecto)
npm install

# Backend
cd backend
npm install
cd ..
```

### 2. Variables de entorno

**Frontend**: `.env.production` en la raíz (se usa al compilar para producción):

```env
REACT_APP_API_URL=https://api.fitcor.fun
```

En desarrollo no hace falta: si la app se sirve en el puerto 3000, apunta automáticamente al backend en el puerto 5000.

**Backend**: `backend/.env`:

```env
MONGO_URI=mongodb+srv://<usuario>:<contraseña>@<cluster>.mongodb.net/fitcor?retryWrites=true&w=majority
JWT_SECRET=<secreto_largo_y_aleatorio>
PORT=5000
NODE_ENV=development
```

### 3. MongoDB Atlas

- Crear un cluster en [MongoDB Atlas](https://cloud.mongodb.com)
- En *Network Access*, permitir la IP desde la que se conecta el backend
- Crear un usuario de base de datos y copiar la cadena de conexión en `MONGO_URI`

## Comandos

| Comando | Qué hace |
|---|---|
| `npm run dev` | Inicia backend y frontend a la vez (libera antes los puertos 3000 y 5000) |
| `npm run dev:concurrent` | Inicia ambos con `concurrently` |
| `npm run dev:full` | Inicia ambos, con el backend en `nodemon` (se recarga al guardar) |
| `npm run frontend` | Solo el frontend (http://localhost:3000) |
| `npm run backend` | Solo el backend (http://localhost:5000) |
| `npm run backend:dev` | Solo el backend, con `nodemon` |
| `npm run build` | Compila el frontend para producción en `build/` |
| `npm test` | Ejecuta los tests |

Scripts de utilidad del backend:

```bash
node backend/scripts/seed-test-users.js   # crea/actualiza los 3 usuarios de prueba
node backend/scripts/export-db.js         # exporta la base de datos a mongo/
```

## API

Las rutas de rutinas requieren el token JWT en la cabecera `x-auth-token`.

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/auth/register` | Registra un usuario y devuelve un token |
| POST | `/api/auth/login` | Inicia sesión y devuelve un token |
| GET | `/api/routines` | Lista las rutinas del usuario (admite filtros, ver abajo) |
| POST | `/api/routines` | Crea una rutina |
| PUT | `/api/routines/:id` | Actualiza una rutina |
| PATCH | `/api/routines/:id` | Actualiza solo los campos enviados |
| DELETE | `/api/routines/:id` | Borra una rutina |

### Filtros del listado de rutinas

Se pueden combinar entre sí y se resuelven con operadores de MongoDB:

| Query param | Ejemplo | Operador |
|---|---|---|
| `name` | `?name=core` | `$regex` (coincidencia parcial, sin distinguir mayúsculas) |
| `ejercicios` | `?ejercicios=Sentadilla,Plancha` | `$in` |
| `minEjercicios` | `?minEjercicios=3` | `$gte` sobre `$size` |
| `desde` / `hasta` | `?desde=2026-01-01&hasta=2026-12-31` | `$gte` y `$lte` sobre `createdAt` |

En [backend/api.http](backend/api.http) están todas las peticiones listas para lanzarlas
desde VS Code con la extensión REST Client.

## Estructura del proyecto

```
fitcor/
├── src/                      # Frontend React (imports absolutos desde src/, ver jsconfig.json)
│   ├── api/                  # Cliente HTTP (apiFetch)
│   ├── components/           # Componentes reutilizables
│   │   └── css/              # Estilos de los componentes
│   ├── context/              # Contexto de autenticación
│   ├── data/                 # Datos estáticos (ejercicios)
│   ├── hooks/                # Hooks personalizados
│   ├── img/                  # Imágenes
│   ├── paginas/              # Páginas de la aplicación
│   │   └── css/              # Estilos de las páginas
│   └── utils/                # Utilidades (logger)
├── backend/                  # API Express
│   ├── controllers/          # Lógica de cada endpoint
│   ├── middleware/           # Verificación del token JWT
│   ├── models/               # Esquemas de Mongoose
│   ├── routes/               # Definición de rutas
│   ├── scripts/              # Usuarios de prueba y exportación de la BD
│   ├── utils/                # Transacciones de MongoDB (withTransaction)
│   └── server.js             # Punto de entrada
├── docs/                     # Documentación (despliegue)
├── mongo/                    # Copia de la base de datos en JSON
└── public/                   # Archivos estáticos base
```

## Despliegue

La aplicación está desplegada en un VPS con nginx y pm2. El proceso completo (despliegue atómico del frontend, actualización del backend, verificación y problemas conocidos) está en **[docs/despliegue.md](docs/despliegue.md)**.

## Tecnologías

**Frontend**: React 19, React Router, React Toastify, React Leaflet, qrcode.react, PropTypes

**Backend**: Node.js, Express, Mongoose, JSON Web Token, bcryptjs, Helmet, Morgan, CORS

## Solución de problemas

### Error de conexión a MongoDB
1. Verificar la cadena `MONGO_URI` (usuario, contraseña y nombre de la base de datos)
2. Comprobar que la IP está permitida en *Network Access* de Atlas

### Error de CORS
El origen debe estar en la lista `allowedOrigins` de `backend/server.js`.

### Errores en producción
Ver la sección *Problemas conocidos* de [docs/despliegue.md](docs/despliegue.md).
