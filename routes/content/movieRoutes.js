const express = require('express');
const router = express.Router();
const movieController = require('../../controllers/content/movieController');
const checkRoleMiddleware = require('../../middlewares/checkRoleMiddleware');

// Ruta para crear una pelicula
router.post('/create', [checkRoleMiddleware('admin')] , movieController.createMovie);

// Ruta para obtener todas las peliculas
router.get('/all', movieController.getAllMovies);

module.exports = router;