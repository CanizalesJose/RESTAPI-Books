const router = require('express').Router();
const userDAO = require('../models/userDAO');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { authenticateToken, authorizeRoles, printPath } = require('../utils');

// Recibe en el body un username y password, regresa 201 y el token generado si el usuario existe
router.post('/login', async (req, res) => {
    printPath(req.path, req.method);
    try {
        const {username, password} = req.body;
        if (!username || !password)
            throw new Error("Faltan credenciales");
        const user = await userDAO.findUser(username);
        if (!user || user.length == 0 || !bcrypt.compareSync(password, user[0]['userpassword'])){
            return res.status(401).json({message: 'Credenciales inválidas'});
        }
        const token = jwt.sign({username: user[0]['username'], usertype: user[0]['usertype']}, process.env.SECRET_KEY, {expiresIn: '5m'});
        return res.status(201).json({token: token, username: user[0]['username'], usertype: user[0]['usertype']});
    } catch (error) {
        if (error.sqlState)
            return res.status(500).json({message: 'Error interno en consulta'});
        return res.status(400).json({message: error.message});
    }
});
// Confirma que un token siga en funcionamiento
router.post('/validToken', authenticateToken, async (req, res) => {
    printPath(req.path, req.method);
    try {
        return res.status(200).json(req.user);
    } catch (error) {
        return res.status(400).json({clearToken: true});
    }
});
// Recibe en el body un usuario y contraseña en texto plano
router.post('/register', authenticateToken, authorizeRoles(['admin']), async (req, res) => {
    printPath(req.path, req.method);
    try {
        const {username, password, usertype} = req.body;
        await userDAO.registerUser(username, password, usertype);
        return res.status(200).json({message: 'El usuario se ha registrado'});
    } catch (error) {
        if (error.sqlState)
            return res.status(500).json({message: 'Error interno en consulta'});
        return res.status(400).json({message: error.message});
    }
});
// Ruta pública para que los clientes se registren a si mismos
router.post('/registerClient', async (req, res) => {
    printPath(req.path, req.method);
    try {
        const {username, password} = req.body;
        await userDAO.registerUser(username, password, 'client');
        return res.status(200).json({message: 'Registrado correctamente'});
    } catch (error) {
        if (error.sqlState)
            return res.status(500).json({message: 'Error interno en consulta'});
        return res.status(400).json({message: error.message});
    }
});
// Ruta protegida, regresa todos los usuarios autenticados
router.get('/findAll', async (req, res) => {
    printPath(req.path, req.method);
    try {
        const users = await userDAO.findAllUsers();
        return res.status(200).json(users); 
    } catch (error) {
        if (error.sqlState)
            return res.status(500).json({message: 'Error interno en consulta'});
        return res.status(400).json({message: error.message});
    }
});
// Ruta protegida para modificar usuarios
router.patch('/update', authenticateToken, authorizeRoles(['client']), async (req, res) =>{
    printPath(req.path, req.method);
    try {
        const {username, password, usertype} = req.body;
        await userDAO.updateUser(username, password, usertype);
        return res.status(201).json({message: `Usuario actualizado correctamente`});
    } catch (error) {
        if (error.sqlState)
            return res.status(500).json({message: 'Error interno en consulta'});
        return res.status(400).json({message: error.message});
    }
});
// Ruta protegida para eliminar usuarios
router.delete('/delete', /* authenticateToken, authorizeRoles(['admin']), */ async (req, res) => {
    printPath(req.path, req.method);
    try {
        const {username} = req.body;
        await userDAO.deleteUser(username);
        return res.status(200).json({message: 'Registro eliminado'});
    } catch (error) {
        if (error.sqlState){
            if (error.errno == 1451)
                return res.status(400).json({message: "No se puede eliminar dado que forma parte de otro registro"});
            else
                return res.status(500).json({message: 'Error interno en consulta'});
        }
        return res.status(500).json({message: error.message});
    }
});
// Middleware para gestionar rutas no existentes
router.use((req, res, next) =>{
    return res.status(404).json([{message: `The requested route with method ${req.method} does not exists`}]);
});
module.exports = router;