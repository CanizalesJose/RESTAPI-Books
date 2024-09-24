const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
// Middleware que verifica que se haya enviado un token en el campo head
const authenticateToken = (req, res, next) => {
    // Obtener el token del encabezado
    const token = req.headers['token'];

    // Si no se ingresa un token, regresa estado de error
    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
        // Si el token no es valido, regresa un código de error
        if (err) return res.sendStatus(403);
        // Si no se genera el error, entonces guarda los datos del usuario que generó el token en la variable de la request
        req.user = user;
        // Pasa al siguiente middleware, probablemente la función del endpoint
        next();
    });
};
// Función que regresa un middleware, toma como parametro un array de roles
const authorizeRoles = (roles) => {
    return (req, res, next) => {
        const user = req.user;
        if (!roles.includes(user['usertype'])){
            return res.sendStatus(403);
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

module.exports = {
    authenticateToken, printPath, authorizeRoles, encryptText, newError
}