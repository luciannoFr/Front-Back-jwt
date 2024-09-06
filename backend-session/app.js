import express from 'express';
import cors from 'cors';
import session from 'express-session';
import morgan from 'morgan';
import path from 'path';

import authRoutes from './routes/auth.js'; // Importar las rutas modularizadas
import { database } from './db/connection.js';

const app = express();
const PORT = process.env.PORT || 4000;
const __dirname = path.resolve();

// Middlewares
app.use(cors({
    origin: ['http://localhost:5500', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true // Habilitar envío de cookies
}));

app.use(morgan('dev'));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // Servir archivos estáticos

app.use(session({
    secret: 'mi_secreto', // Cambiar a process.env.SESSION_SECRET si se usa variable de entorno
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false, // Cambiar a true si usas HTTPS
        httpOnly: true // Evita acceso a cookies desde el cliente
    }
}));

// Usar rutas modularizadas
app.use('/auth', authRoutes);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}/`);
});
