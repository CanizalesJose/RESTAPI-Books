const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
// Middleware que verifica que se haya enviado un token en el campo head
const authenticateToken = (req, res, next) => {
    // Obtener el token del encabezado
    const token = req.headers['token'];

    // Si no se ingresa un token, regresa estado de error
    if (!token) return res.status(401).json({message: 'Falta token de autenticación'});

    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
        // Si el token no es valido, regresa un estado de error
        if (err) return res.status(401).json({message: 'Token rechazado'});
        // Si no se genera el error, entonces guarda los datos del usuario que generó el token en la variable de la request
        req.user = user;
        // Pasa al siguiente middleware, probablemente la función del endpoint o authorizeRoles
        next();
    });
};
// Función que regresa un middleware, toma como parametro un array de roles
const authorizeRoles = (roles) => {
    return (req, res, next) => {
        const user = req.user;
        if (!roles.includes(user['usertype'])){
            // Si se encuentra autenticado, pero no tiene privilegios, regresa un estado de error distinto
            return res.status(403).json({message: 'Permisos insuficientes'});
        }
        next();
    }
}

const printPath = (path, method) => {
    console.log(`${method} on route ${path}`);
}

const encryptText = (text) => {
    const salt = bcrypt.genSaltSync(10);
    const hashedText = bcrypt.hashSync(text, salt);
    return hashedText
}

const newError = (statusCode, message) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
}

const genId = (length) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const randomLength = Math.floor(Math.random() * length) + 1;

    for (let i = 0; i < randomLength; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return result;
}
module.exports = {
    authenticateToken, 
    printPath, 
    authorizeRoles, 
    encryptText, 
    newError,
    genId
}