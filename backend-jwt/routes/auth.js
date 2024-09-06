import { Router } from 'express';
import { login, validarSesion, logout, register } from '../controllers/authController.js';
import validarJwt from '../middlewares/validar-jwt.js';

const router = Router();

// Ruta de registro de usuario
router.post('/register', register);


// Ruta de inicio de sesión
router.post('/login', login);

// Ruta de validación de sesión
router.get('/session', validarJwt, validarSesion);

// Ruta de cierre de sesión
router.post('/logout', logout);

export default router;
