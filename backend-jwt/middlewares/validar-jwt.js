import jwt from 'jsonwebtoken';

const validarJwt = (req, res, next) => {
    const token = req.cookies.authToken || req.session.token;

    if (!token) {
        return res.status(401).json({ message: 'Token no proporcionado' });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token no válido' });
    }
};

export default validarJwt;
