const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const fs = require('fs');
const mongoose = require('mongoose');
const User = require('../models/user');
const Routine = require('../models/routine');

// Exporta las colecciones users y routines de MongoDB Atlas a la carpeta mongo/
// del proyecto, en formato JSON, para poder importarlas en un MongoDB local.
const OUTPUT_DIR = path.join(__dirname, '..', '..', 'mongo');

// Dominios de cuentas de prueba, que se exportan tal cual. Cualquier otro email es de
// una persona real y se sustituye por usuarioN@example.com, porque la copia se sube al repositorio.
const DOMINIOS_DE_PRUEBA = ['fitcor.fun', 'email.com', 'example.com'];

function anonimizarEmails(users) {
    let n = 0;
    return users.map((user) => {
        const dominio = String(user.email).split('@')[1];
        if (DOMINIOS_DE_PRUEBA.includes(dominio)) return user;
        n += 1;
        return { ...user, email: `usuario${n}@example.com` };
    });
}

async function exportDb() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Conectado a MongoDB');

    const users = anonimizarEmails(await User.find().lean());
    const routines = await Routine.find().lean();

    fs.writeFileSync(path.join(OUTPUT_DIR, 'users.json'), JSON.stringify(users, null, 2));
    fs.writeFileSync(path.join(OUTPUT_DIR, 'routines.json'), JSON.stringify(routines, null, 2));

    console.log(`Exportados ${users.length} usuarios a mongo/users.json`);
    console.log(`Exportadas ${routines.length} rutinas a mongo/routines.json`);
}

exportDb()
    .then(() => mongoose.connection.close())
    .then(() => process.exit(0))
    .catch((err) => {
        console.error('Error al exportar la base de datos:', err);
        mongoose.connection.close().finally(() => process.exit(1));
    });
