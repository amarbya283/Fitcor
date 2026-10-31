const mongoose = require('mongoose');

// Errores con los que MongoDB indica que el servidor no admite transacciones
// (por ejemplo, un mongod local "standalone", sin replica set).
const isTransactionUnsupported = (err) =>
    Boolean(err) &&
    (err.code === 20 || /replica set|Transaction numbers are only allowed/i.test(err.message || ''));

// Ejecuta fn(session) dentro de una transacción: si algo falla, MongoDB deshace
// todos los cambios hechos con esa sesión.
//
// MongoDB Atlas siempre admite transacciones (es un replica set). Si el servidor
// no las admite, como un MongoDB local donde se ha importado la copia de mongo/,
// se ejecuta fn sin sesión para no romper las pruebas en local.
//
// session.withTransaction puede reintentar fn ante errores transitorios, así que fn
// debe poder ejecutarse más de una vez (crear los documentos dentro de fn, no fuera).
exports.withTransaction = async (fn) => {
    const session = await mongoose.startSession();
    try {
        let result;
        await session.withTransaction(async () => {
            result = await fn(session);
        });
        return result;
    } catch (err) {
        if (isTransactionUnsupported(err)) {
            return await fn(null);
        }
        throw err;
    } finally {
        await session.endSession();
    }
};
