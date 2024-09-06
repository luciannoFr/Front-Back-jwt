import generarToken from '../helpers/generar-jwt.js'; // Importar la función desde el archivo
import { database } from '../db/connection.js';

// Controlador para el inicio de sesión
export const login = async (req, res) => {
    const { username, password } = req.body;

    // Buscar usuario en la base de datos
    const user = database.user.find(u => u.username === username && u.password === password);

    if (user) {
        try {
            // Generar token JWT para el usuario
            const token = await generarToken(user.id); // Usamos la función que importamos

            // Guardar información del usuario en la sesión
            req.session.userId = user.id;
            req.session.username = user.username;
            req.session.token = token; // Guardamos el token en la sesión también, si lo deseas

            return res.json({
                message: 'Inicio de sesión exitoso',
                token, // Devolvemos el token al cliente
                user: { id: user.id, username: user.username }
            });
        } catch (error) {
            return res.status(500).json({ message: 'Error al generar el token' });
        }
    } else {
        return res.status(401).json({ message: 'Credenciales incorrectas' });
    }
};

// Controlador para validar la sesión del usuario
export const validarSesion = (req, res) => {
    if (req.session.userId) {
        return res.json({
            loggedIn: true,
            user: { id: req.session.userId, username: req.session.username },
            token: req.session.token // Devolvemos el token si está en la sesión
        });
    } else {
        return res.status(401).json({ loggedIn: false, message: 'No hay sesión activa' });
    }
};

// Controlador para cerrar la sesión
export const logout = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ message: 'Error al cerrar la sesión' });
        }
        res.clearCookie('connect.sid'); // Eliminar la cookie de sesión
        return res.json({ message: 'Sesión cerrada exitosamente' });
    });
};

// Controlador para registrar un nuevo usuario (aún por implementar)
export const register = async (req, res) => {
    const { username, password } = req.body;

    // Verificar si el usuario ya existe
    const existingUser = database.user.find(u => u.username === username);
    
    if (existingUser) {
        return res.status(400).json({ message: 'El nombre de usuario ya está en uso' });
    }

    // Crear un nuevo usuario (debería implementar lógica para almacenar el nuevo usuario en la base de datos)
    const newUser = { id: Date.now(), username, password }; // Aquí usarías una base de datos real para almacenar al usuario

    database.user.push(newUser); // Simulamos el almacenamiento en la base de datos

    return res.status(201).json({
        message: 'Usuario registrado exitosamente',
        user: { id: newUser.id, username: newUser.username }
    });
};
