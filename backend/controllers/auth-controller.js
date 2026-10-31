const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { withTransaction } = require('../utils/with-transaction');

// Duración de la sesión que se firma en el token
const TOKEN_EXPIRACION = '1d';

// Registro: crea un usuario nuevo con la contraseña hasheada y devuelve un JWT
exports.register = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        // Comprobación de los datos recibidos antes de tocar la base de datos
        if (!email || !password) {
            return res.status(400).json({ msg: 'Email y contraseña son obligatorios' });
        }

        // Nunca se guarda la contraseña en texto plano, solo su hash con salt.
        // Se calcula antes de la transacción para que esta dure lo mínimo posible.
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Comprobar que el email no existe y crear el usuario en la misma transacción,
        // para que dos registros simultáneos con el mismo email no puedan colarse a la vez
        const user = await withTransaction(async (session) => {
            const exists = await User.findOne({ email }).session(session);
            if (exists) return null;
            return new User({ email, password: hashedPassword }).save({ session });
        });
        if (!user) return res.status(400).json({ msg: 'El usuario ya existe' });

        // El token solo lleva el id de usuario; no incluye datos sensibles
        const payload = { userId: user._id };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: TOKEN_EXPIRACION });
        res.status(201).json({ token });
    } catch (err) {
        // El middleware de errores de server.js decide la respuesta y registra el fallo
        next(err);
    }
};

// Login: valida credenciales contra el hash guardado y devuelve un JWT de sesión.
// Solo lee datos, así que no necesita transacción.
exports.login = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ msg: 'Email y contraseña son obligatorios' });
        }

        const user = await User.findOne({ email });
        // Mismo mensaje si el email no existe o si la contraseña es incorrecta,
        // para no revelar qué emails están registrados
        if (!user) return res.status(400).json({ msg: 'Credenciales inválidas' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Credenciales inválidas' });

        const payload = { userId: user._id };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: TOKEN_EXPIRACION });
        res.status(200).json({ token });
    } catch (err) {
        next(err);
    }
};
