const express = require('express');
const router = express.Router();
const genreController = require('../../controllers/content/genreController');
const checkRoleMiddleware = require('../../middlewares/checkRoleMiddleware');

// Crear un genero
router.post('/create', [checkRoleMiddleware('admin')], genreController.createGenre);

// Obtener todos los generos
router.get('/all', genreController.getAllGenres);

module.exports = router;