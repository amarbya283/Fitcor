const mongoose = require('mongoose');

// Schema de usuario: guarda las credenciales para login/registro con JWT.
const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true, // obligatorio para poder identificar y loguear al usuario
        unique: true // no se permiten dos cuentas con el mismo email
    },
    password: {
        type: String,
        required: true // se guarda ya hasheada con bcrypt, nunca en texto plano
    }
});

module.exports = mongoose.model('User', UserSchema);