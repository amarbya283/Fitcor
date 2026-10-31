const mongoose = require('mongoose');

// Schema de rutina de entrenamiento: pertenece a un usuario y contiene una lista de ejercicios.
const RoutineSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true // nombre de la rutina, usado también para el filtro por $regex
    },
    description: {
        type: String // texto libre opcional con detalles de la rutina
    },
    exercises: [
        {
            name: String, // nombre del ejercicio
            sets: Number, // número de series
            reps: Number // número de repeticiones por serie
        }
    ],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // referencia al dueño de la rutina, para filtrar por propiedad
        required: true
    }
}, { timestamps: true }); // añade createdAt/updatedAt automáticamente

module.exports = mongoose.model('Routine', RoutineSchema);