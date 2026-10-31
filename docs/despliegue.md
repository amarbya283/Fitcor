# Despliegue de Fitcor en producción

Esta guía describe cómo está desplegada realmente la aplicación y cómo publicar cambios sin cortar el servicio.

## Arquitectura

```
Navegador
   │  HTTPS (certificados de Let's Encrypt gestionados por Certbot)
   ▼
nginx (VPS Debian)
   ├── www.fitcor.fun / fitcor.fun ──► archivos estáticos en /home/build   (frontend React compilado)
   │                               └─► /api/ ──► proxy a localhost:5000
   └── api.fitcor.fun ───────────────► proxy a localhost:5000
                                            │
                                            ▼
                               pm2: proceso "fitcor-backend"
                               /root/Fitcor/backend/server.js (Express)
                                            │
                                            ▼
                               MongoDB Atlas (base de datos "fitcor")
```

| Pieza | Ubicación en el servidor |
|---|---|
| Frontend compilado | `/home/build` |
| Backend (código fuente) | `/root/Fitcor/backend` |
| Variables de entorno del backend | `/root/Fitcor/backend/.env` (no está en el repositorio) |
| Proceso del backend | pm2, nombre `fitcor-backend` |
| Config. nginx del frontend | `/etc/nginx/sites-available/fitcor.fun` |
| Config. nginx de la API | `/etc/nginx/sites-available/fitcor` |

## Requisitos del servidor

- Node.js 18 o superior (Helmet 8 lo exige). El servidor usa actualmente Node 25.
- pm2, nginx y Certbot.
- Registros DNS de tipo A de `fitcor.fun`, `www.fitcor.fun` y `api.fitcor.fun` apuntando a la IP del VPS.

## Variables de entorno

**Backend** (`/root/Fitcor/backend/.env` en el servidor; en local, `backend/.env`):

```env
MONGO_URI=mongodb+srv://<usuario>:<contraseña>@<cluster>.mongodb.net/fitcor?retryWrites=true&w=majority
JWT_SECRET=<secreto_largo_y_aleatorio>
PORT=5000
NODE_ENV=production
```

**Frontend** (`.env.production` en la raíz del proyecto; se incrusta en el build al compilar):

```env
REACT_APP_API_URL=https://api.fitcor.fun
```

Los orígenes permitidos por CORS están definidos en `backend/server.js` (`allowedOrigins`). Si se añade un dominio nuevo, hay que incluirlo ahí.

## Desplegar el frontend

**1. En local**, generar el build y comprimirlo (PowerShell):

```powershell
npm run build
Compress-Archive -Path "build\*" -DestinationPath "build.zip" -Force
scp build.zip root@IP_DEL_VPS:/home/
```

Antes de subirlo, comprobar que `build/` no contiene ninguna carpeta `.git`. Create React App copia todo lo que haya en `public/` dentro de `build/`, así que nunca debe existir un repositorio git dentro de `public/`.

**2. En el servidor**, descomprimir de forma **atómica**:

```bash
cd /home
rm -rf build_new && mkdir build_new
unzip -q -o build.zip -d build_new/
rm -rf build_old
mv build build_old && mv build_new build
rm -f build.zip
ls build/index.html && echo "OK: despliegue atómico completado"
```

> Nunca vaciar `/home/build` y descomprimir encima (`rm -rf build/* && unzip ... -d build/`). Mientras dura la descompresión la carpeta queda vacía, y nginx responde **500 Internal Server Error** a cualquier visitante (en el log aparece `rewrite or internal redirection cycle while internally redirecting to "/index.html"`). Con el método de arriba, el cambio se reduce a un `mv`, que es instantáneo.

**Revertir** si algo va mal:

```bash
cd /home && mv build build_roto && mv build_old build
```

## Desplegar el backend

**1. En local**, comprimir el código que se ejecuta en el servidor (nunca `node_modules` ni `.env`). Ante la duda, subir todas estas carpetas y archivos, no solo lo que se cree modificado:

```powershell
Compress-Archive -Path "backend\controllers","backend\middleware","backend\models","backend\routes","backend\utils","backend\server.js","backend\package.json","backend\package-lock.json" -DestinationPath "backend_update.zip" -Force
scp backend_update.zip root@IP_DEL_VPS:/home/
```

> Olvidar una carpeta hace que el servidor siga ejecutando una versión antigua sin que se note. Pasó con `middleware/`, que nunca se había subido: producción siguió escribiendo logs de depuración del token mucho después de haberlos quitado en local. Para comparar, se puede revisar con `pm2 logs` si el comportamiento coincide con el código del repositorio.

**2. En el servidor**:

```bash
cd /home
unzip -o backend_update.zip -d /root/Fitcor/backend/
rm backend_update.zip
cd /root/Fitcor/backend
npm install          # solo si cambió package.json
pm2 restart fitcor-backend --update-env
pm2 logs fitcor-backend --lines 20 --nostream
```

> `unzip -o` añade y sobrescribe, pero no borra. Si se renombra o elimina un archivo en local, hay que borrar también la versión antigua en el servidor. Linux distingue mayúsculas y minúsculas, así que `User.js` y `user.js` son archivos distintos y ambos quedarían en disco.

## Verificación tras desplegar

```bash
# El sitio responde
curl -s -o /dev/null -w "%{http_code}\n" https://www.fitcor.fun/

# El login funciona de principio a fin
curl -s -X POST https://api.fitcor.fun/api/auth/login \
  -H "Content-Type: application/json" -H "Origin: https://www.fitcor.fun" \
  -d '{"email":"evaluador1@fitcor.fun","password":"Fitcor2026!"}'

# No hay una carpeta .git expuesta (debe devolver el index.html de la app, no la configuración de git)
curl -s https://www.fitcor.fun/.git/config | head -c 80
```

## Problemas conocidos

| Síntoma | Causa | Solución |
|---|---|---|
| 500 de nginx con `rewrite or internal redirection cycle` en el log | Despliegue no atómico: `/home/build` quedó vacío un instante | Usar la secuencia atómica de esta guía |
| El login devuelve 500 | El backend no conecta con Atlas (contraseña o base de datos incorrecta en `MONGO_URI`) | Revisar `/root/Fitcor/backend/.env` y reiniciar pm2 con `--update-env` |
| Error de CORS en el navegador y la API responde **403** `Origen no permitido por CORS` | El origen no está en `allowedOrigins` | Añadirlo en `backend/server.js` y redesplegar el backend |
| Aparece `build/.git` | Hay un repositorio git dentro de `public/` | Borrar `public/.git` |
| `pm2 restart` no aplica un cambio del `.env` | pm2 conserva las variables del arranque anterior | Reiniciar con `--update-env` |

## Datos de prueba

- `backend/scripts/seed-test-users.js` crea o actualiza los usuarios de prueba `evaluador1@fitcor.fun`, `evaluador2@fitcor.fun` y `evaluador3@fitcor.fun`.
- `backend/scripts/export-db.js` exporta las colecciones de Atlas a la carpeta `mongo/` (ver `mongo/README.md`).
