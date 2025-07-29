const express = require('express');
const router = express.Router();
const usersController = require('../../controllers/users/userController');

//Ruta para crear usuario
router.post('/create', usersController.createUser);

//Ruta para obtener todos los usuarios
router.get('/all', usersController.getAllUsers);

// Ruta para obtener un usuario por ID
router.get('/:id', usersController.getUserById);

// Ruta para eliminar un usuario por ID
router.put('/:id', usersController.deleteUser);

module.exports = router;