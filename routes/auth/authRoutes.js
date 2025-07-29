const express = require('express');
const router = express.Router();
const authController = require('../../controllers/auth/authController');

// Registro de Usuario
router.post('/register', authController.register);

// Login de Usuario
router.post('/login', authController.login);

module.exports = router;