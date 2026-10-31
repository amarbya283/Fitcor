const jwt = require('jsonwebtoken');

// Middleware de autenticación: protege las rutas que requieren sesión iniciada.
// Se ejecuta antes del controlador y solo le cede el paso (next) si el token es válido.
// El token viaja en la cabecera x-auth-token, que el frontend añade en api/base.js.
module.exports = function (req, res, next) {
    const token = req.header('x-auth-token');

    // Sin token no se continúa: 401 (no autenticado), no 403 ni 500
    if (!token) return res.status(401).json({ msg: 'No hay token, autorización denegada' });

    try {
        // jwt.verify comprueba la firma con JWT_SECRET y que no haya caducado;
        // si algo falla lanza una excepción que se captura abajo
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Se guarda el id del usuario en req.user para que los controladores
        // filtren siempre por propietario y nadie acceda a rutinas ajenas
        req.user = decoded.userId;
        next();
    } catch (err) {
        // Token manipulado, caducado o con otra firma: es un error del cliente,
        // no del servidor, así que se responde 401 sin detalles internos
        res.status(401).json({ msg: 'Token no válido' });
    }
};
