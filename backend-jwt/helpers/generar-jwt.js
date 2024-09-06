import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../config/env.js'; // Importamos la clave secreta de las variables de entorno

export default ( userId ) => {
    return new Promise( (resolve, reject) => {
        const payload = { userId };

        jwt.sign(payload, SECRET_KEY, {
            expiresIn: '5h' // El token expira en 5 horas (actualizado)
        }, (error, token) => {
            if (error) {
                console.log(error);
                reject('No se pudo generar el token');
            } else {
                resolve(token); // Devolvemos el token si se genera correctamente
            }
        });
    });
};
