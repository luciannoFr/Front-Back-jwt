const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Ruta para registrar un nuevo usuario
router.post('/register', userController.register);

// Ruta para iniciar sesión
router.post('/login', userController.login);

// Ruta para cerrar sesión
router.post('/logout', userController.logout);

module.exports = router;
