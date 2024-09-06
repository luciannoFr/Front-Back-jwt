const connection = require('../db/connection');
const jwt = require('jsonwebtoken');

// Registrar un nuevo usuario
exports.register = (req, res) => {
    const { username, password } = req.body;
    const query = 'INSERT INTO users (username, password) VALUES (?, ?)';

    connection.query(query, [username, password], (err, results) => {
        if (err) return res.status(500).json({ error: 'Error registering user' });
        res.status(201).send('User registered successfully');
    });
};

// Iniciar sesión de un usuario
exports.login = (req, res) => {
    const { username, password } = req.body;

    const query = 'SELECT * FROM users WHERE username = ?';
    connection.query(query, [username], (err, results) => {
        if (err) return res.status(500).json({ error: 'Error fetching user' });
        if (results.length === 0) return res.status(401).json({ error: 'User not found' });

        const user = results[0];

        // Comparar la contraseña proporcionada con la almacenada (sin encriptado)
        if (user.password !== password) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        // Generar el token JWT
        const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, { expiresIn: '5h' });
        res.json({ token });
    });
};

// Cerrar sesión de un usuario
exports.logout = (req, res) => {
    const token = req.headers.authorization.split(' ')[1]; // Asumiendo que el token se pasa en el header

    const query = 'INSERT INTO revoked_tokens (token) VALUES (?)';
    connection.query(query, [token], (err, results) => {
        if (err) return res.status(500).json({ error: 'Error logging out' });
        res.send('User logged out successfully');
    });
};

