import generarToken from '../utils/generateToken.js'; // Importar la función desde el archivo
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

// Controlador para obtener los datos de la sesión
export const obtenerSesion = (req, res) => {
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
