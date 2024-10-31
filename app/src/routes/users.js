const router = require('express').Router();
const userDAO = require('../models/userDAO');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { authenticateToken, authorizeRoles, printPath, newError } = require('../utils');

// Recibe en el body un username y password, regresa 201 y el token generado si el usuario existe
router.post('/login/:username', async (req, res) => {
    printPath(req.originalUrl, req.method);
    try {
        const username = req.params.username;
        const {password} = req.body;
        if (!username || !password)
            throw new Error("Faltan credenciales");
        const user = await userDAO.findUser(username);
        if (!user || user.length == 0 || !bcrypt.compareSync(password, user[0]['userpassword'])){
            return res.status(401).json({message: 'Credenciales inválidas'});
        }
        const token = jwt.sign({username: user[0]['username'], usertype: user[0]['usertype']}, process.env.SECRET_KEY || 'test', {expiresIn: '4h'});
        return res.status(201).json({token: token, username: user[0]['username'], usertype: user[0]['usertype']});
    } catch (error) {
        console.log(error);
        if (error.sqlState){
            if (error.errno == 1451)
                return res.status(400).json({message: "No se puede eliminar dado que forma parte de otro registro"});
            return res.status(500).json({message: 'Error interno en consulta'});
        }
        const statusCode = error.statusCode || 500;
        return res.status(statusCode).json({message: error.message});
    }
});
// Confirma que un token siga en funcionamiento
router.get('/validToken', authenticateToken, async (req, res) => {
    printPath(req.originalUrl, req.method);
    return res.status(200).json({user: req.user});
});
router.get('/validAdmin', authenticateToken, authorizeRoles(['admin']), async (req, res) => {
    printPath(req.originalUrl, req.method);
    return res.sendStatus(200);
});
// Recibe en el body un usuario y contraseña en texto plano
router.post('/register/:username', authenticateToken, authorizeRoles(['admin']), async (req, res) => {
    printPath(req.originalUrl, req.method);
    try {
        const username = req.params.username;
        const {password, usertype, contactNumber, email} = req.body;
        await userDAO.registerUser(username, password, usertype, contactNumber, email);
        return res.status(201).json({message: 'El usuario se ha registrado'});
    } catch (error) {
        if (error.sqlState){
            if (error.errno == 1451)
                return res.status(400).json({message: "No se puede eliminar dado que forma parte de otro registro"});
            return res.status(500).json({message: 'Error interno en consulta'});
        }
        const statusCode = error.statusCode || 500;
        return res.status(statusCode).json({message: error.message});
    }
});
// Ruta pública para que los clientes se registren a si mismos
router.post('/registerClient/:username', async (req, res) => {
    printPath(req.originalUrl, req.method);
    try {
        const username = req.params.username;
        const {password, contactNumber, email} = req.body;
        await userDAO.registerUser(username, password, 'client', contactNumber, email);
        return res.status(200).json({message: 'Registrado correctamente'});
    } catch (error) {
        if (error.sqlState){
            if (error.errno == 1451)
                return res.status(400).json({message: "No se puede eliminar dado que forma parte de otro registro"});
            return res.status(500).json({message: 'Error interno en consulta'});
        }
        const statusCode = error.statusCode || 500;
        return res.status(statusCode).json({message: error.message});
    }
});
router.get('/find/me', authenticateToken, async (req, res) => {
    printPath(req.originalUrl, req.method);
    try {
        const username = req.user.username;
        var user = await userDAO.findUser(username);
        user = user[0];
        user.userpassword = null;
        return res.status(200).json({user: user});
    } catch (error) {
        if (error.sqlState){
            if (error.errno == 1451)
                return res.status(400).json({message: "No se puede eliminar dado que forma parte de otro registro"});
            return res.status(500).json({message: 'Error interno en consulta'});
        }
        const statusCode = error.statusCode || 500;
        return res.status(statusCode).json({message: error.message});
    }
});
// Ruta protegida, regresa todos los usuarios autenticados
router.get('/findAll', authenticateToken, authorizeRoles(['admin']), async (req, res) => {
    printPath(req.originalUrl, req.method);
    try {
        const users = await userDAO.findAllUsers();
        return res.status(200).json(users); 
    } catch (error) {
        if (error.sqlState){
            if (error.errno == 1451)
                return res.status(400).json({message: "No se puede eliminar dado que forma parte de otro registro"});
            return res.status(500).json({message: 'Error interno en consulta'});
        }
        const statusCode = error.statusCode || 500;
        return res.status(statusCode).json({message: error.message});
    }
});
// Ruta protegida para modificar usuarios
router.patch('/update/:username', authenticateToken, authorizeRoles(['admin']), async (req, res) =>{
    printPath(req.originalUrl, req.method);
    try {
        const username = req.params.username;
        const {password, usertype, contactNumber, email} = req.body;
        if (req.user.username == username)
            throw newError(400, 'No se puede actualizar al usuario activo');
        await userDAO.updateUser(username, password, usertype, contactNumber, email);
        return res.status(201).json({message: `Usuario actualizado correctamente`});
    } catch (error) {
        if (error.sqlState){
            if (error.errno == 1451)
                return res.status(400).json({message: "No se puede eliminar dado que forma parte de otro registro"});
            return res.status(500).json({message: 'Error interno en consulta'});
        }
        const statusCode = error.statusCode || 500;
        return res.status(statusCode).json({message: error.message});
    }
});
// Ruta pública para modificar datos de usuario
router.patch('/updateCLient', authenticateToken, async (req, res) => {
    printPath(req.originalUrl, req.method);
    try {
        const username = req.user.username;
        const {contactNumber, email, password, currentPassword} = req.body;
        await userDAO.updateUserClient(username, contactNumber, email, password, currentPassword);
        return res.status(200).json({message: 'Usuario actualizado correctamente'});
    } catch (error) {
        if (error.sqlState){
            if (error.errno == 1451)
                return res.status(400).json({message: "No se puede eliminar dado que forma parte de otro registro"});
            return res.status(500).json({message: 'Error interno en consulta'});
        }
        const statusCode = error.statusCode || 500;
        return res.status(statusCode).json({message: error.message});
    }
});
// Ruta protegida para eliminar usuarios
    router.delete('/delete/:username', authenticateToken, authorizeRoles(['admin']), async (req, res) => {
    printPath(req.originalUrl, req.method);
    try {
        const username = req.params.username;
        if (req.user.username == username)
            throw newError(400, 'No se puede eliminar al usuario activo')
        await userDAO.deleteUser(username);
        return res.status(200).json({message: 'Registro eliminado'});
    } catch (error) {
        if (error.sqlState){
            if (error.errno == 1451)
                return res.status(400).json({message: "No se puede eliminar dado que forma parte de otro registro"});
            return res.status(500).json({message: 'Error interno en consulta'});
        }
        const statusCode = error.statusCode || 500;
        return res.status(statusCode).json({message: error.message});
    }
});
// Middleware para gestionar rutas no existentes
router.use((req, res, next) =>{
    return res.status(404).json([{message: `The requested route with method ${req.method} does not exists`}]);
});
module.exports = router;