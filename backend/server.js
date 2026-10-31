require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const authRoutes = require('./routes/auth');
const routineRoutes = require('./routes/routines');

const app = express();

// Middlewares
// CORS se restringe a una lista blanca (dominio de producción + localhost de desarrollo)
// en vez de aceptar cualquier origen, para que solo el frontend de Fitcor pueda
// llamar a la API con credenciales.
const allowedOrigins = [
    'https://www.fitcor.fun',
    'https://fitcor.fun',
    'http://localhost:3000'
];
app.use(helmet()); // cabeceras HTTP de seguridad por defecto
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev')); // logging de peticiones
app.use(cors({
    origin: (origin, callback) => {
        // origin es undefined en peticiones sin navegador (curl, Postman, server-to-server)
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            // 403 y no 500: rechazar un origen desconocido es un comportamiento esperado,
            // no un fallo del servidor. expose indica que el mensaje es seguro de mostrar.
            const err = new Error('Origen no permitido por CORS');
            err.status = 403;
            err.expose = true;
            callback(err);
        }
    },
    credentials: true,
    methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token']
}));
app.options('*', cors()); // responde a las peticiones preflight para cualquier ruta
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/routines', routineRoutes);

// 404 - Ruta no encontrada (se ejecuta si ninguna ruta anterior respondió)
app.use((req, res) => res.status(404).json({ msg: 'Ruta no encontrada' }));

// Middleware de manejo de errores centralizado: captura cualquier error no
// controlado (4 argumentos = Express lo reconoce como error handler) y evita
// exponer detalles internos (stack traces, mensajes de librerías) al cliente.
app.use((err, req, res, next) => {
    const status = err.status || err.statusCode || 500;

    // Errores del cliente (4xx): origen bloqueado por CORS, JSON malformado en el body...
    // Se responde con su código real en vez de 500. Solo se muestra el mensaje si es
    // seguro (expose), para no filtrar textos internos de librerías.
    if (status >= 400 && status < 500) {
        return res.status(status).json({ msg: err.expose ? err.message : 'Petición no válida' });
    }

    console.error('❌ Error no controlado:', err.message);
    res.status(500).json({ msg: 'Error interno del servidor' });
});

// Variable para guardar la referencia del servidor
let server;

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    const PORT = process.env.PORT || 5000;
    server = app.listen(PORT, () => {
        //console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
        //console.log(`📊 Conectado a MongoDB`);
    });
})
.catch(err => {
    console.error('❌ Error al conectar a MongoDB:', err.message);
    process.exit(1);
});

// Función de cierre graceful: al recibir una señal de terminación, deja de
// aceptar conexiones nuevas, cierra el servidor HTTP y luego la conexión a
// MongoDB, en vez de matar el proceso en seco y dejar peticiones a medias.
const gracefulShutdown = async (signal) => {
    //console.log(`\n⚠️  ${signal} recibido. Cerrando aplicación...`);
    
    // Cerrar servidor HTTP primero
    if (server) {
        server.close(async () => {
            //console.log('✅ Servidor HTTP cerrado');
            
            try {
                await mongoose.disconnect();
                //console.log('✅ Conexión a MongoDB cerrada');
                process.exit(0);
            } catch (err) {
                console.error('❌ Error al cerrar MongoDB:', err.message);
                process.exit(1);
            }
        });
    } else {
        try {
            await mongoose.disconnect();
            //console.log('✅ Conexión a MongoDB cerrada');
            process.exit(0);
        } catch (err) {
            console.error('❌ Error al cerrar MongoDB:', err.message);
            process.exit(1);
        }
    }

    // Timeout de seguridad: si el cierre limpio no termina a tiempo, se fuerza la salida
    setTimeout(() => {
        console.error('⏱️  Timeout alcanzado, forzando cierre');
        process.exit(1);
    }, 10000);
};

// Escuchar señales de terminación
process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

// Manejar errores no capturados
process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection en:', promise);
    console.error('Razón:', reason);
    gracefulShutdown('unhandledRejection');
});

process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught Exception:', error);
    gracefulShutdown('uncaughtException');
});

// Eventos de conexión MongoDB
mongoose.connection.on('error', (err) => {
    console.error('❌ Error de conexión MongoDB:', err.message);
});

mongoose.connection.on('disconnected', () => {
    //console.log('⚠️  MongoDB desconectado');
});