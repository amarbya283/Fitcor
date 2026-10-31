const express = require('express');
const routineController = require('../controllers/routine-controller');
const auth = require('../middleware/auth');

const router = express.Router();

// Todas las rutas de rutinas pasan antes por el middleware auth (sesión obligatoria)

// Listar y crear. El listado admite filtros por query params:
// ?name=, ?ejercicios=, ?minEjercicios=, ?desde=, ?hasta=
router.route('/')
    .get(auth, routineController.getRoutines)
    .post(auth, routineController.createRoutine);

// Operaciones sobre una rutina concreta.
// PUT y PATCH comparten controlador: solo se actualizan los campos enviados en el body.
router.route('/:id')
    .put(auth, routineController.updateRoutine)
    .patch(auth, routineController.updateRoutine)
    .delete(auth, routineController.deleteRoutine);

module.exports = router;
