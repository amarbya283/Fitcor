# Copia de la base de datos (MongoDB)

Los archivos `users.json` y `routines.json` son una copia de las colecciones de MongoDB Atlas (cluster `fitcor`, base de datos `fitcor`), exportada con `backend/scripts/export-db.js` para que se pueda probar la aplicación en local sin depender de Atlas.

Los emails de personas reales se sustituyen al exportar por `usuarioN@example.com`
(las cuentas de prueba de `fitcor.fun` y `email.com` se mantienen), de esta forma el
repositorio no publica datos personales. El resto de campos son idénticos a la base de datos.

## Importar en un MongoDB local

Con MongoDB Database Tools instalados, desde esta carpeta:

```
mongoimport --uri="mongodb://localhost:27017/fitcor" --collection=users --file=users.json --jsonArray
mongoimport --uri="mongodb://localhost:27017/fitcor" --collection=routines --file=routines.json --jsonArray
```

Después, se apunta `MONGO_URI` (en `backend/.env`) a
`mongodb://localhost:27017/fitcor` para usar la base de datos local.

## Contraseñas

Las contraseñas de los usuarios están hasheadas con bcrypt, por lo que no pueden
usarse directamente sin conocer la contraseña original. Las credenciales de prueba
documentadas (`evaluador1@fitcor.fun`, `evaluador2@fitcor.fun`, `evaluador3@fitcor.fun`,
contraseña `Fitcor2026!`) están listadas en el `README.md` principal del proyecto.
