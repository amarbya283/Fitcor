const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

// Usuarios de prueba para el evaluador de CEI
const TEST_USERS = [
    { email: 'evaluador1@fitcor.fun', password: 'Fitcor2026!' },
    { email: 'evaluador2@fitcor.fun', password: 'Fitcor2026!' },
    { email: 'evaluador3@fitcor.fun', password: 'Fitcor2026!' }
];

async function seed() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Conectado a MongoDB');

    for (const { email, password } of TEST_USERS) {
        // Mismo hash que el registro en routes/auth.js (bcrypt, salt 10)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // upsert: crea el usuario si no existe, o actualiza su password si ya existe,
        // para que el script sea re-ejecutable sin errores de email duplicado
        await User.findOneAndUpdate(
            { email },
            { email, password: hashedPassword },
            { upsert: true, new: true }
        );
        console.log(`OK - ${email}`);
    }
}

seed()
    .then(() => {
        console.log('Los 3 usuarios de prueba estan listos.');
        return mongoose.connection.close();
    })
    .then(() => process.exit(0))
    .catch((err) => {
        console.error('Error al crear usuarios de prueba:', err);
        mongoose.connection.close().finally(() => process.exit(1));
    });
