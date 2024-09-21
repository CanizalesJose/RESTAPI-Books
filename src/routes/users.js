const router = require('express').Router();
const userModel = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { authenticateToken, authorizeRoles, printPath } = require('../utils');

// Ruta base para comprobar conexión
router.get('/', async (req, res) => {
    printPath(req.path, req.method);

    res.status(200).json({message: 'Access to users on BooksCenter API'});
});
// Recibe en el body un username y password, regresa 201 y el token generado si el usuario existe
router.post('/login', async (req, res) => {
    printPath(req.path, req.method);

    try {
        const {loginUsername, loginPassword} = req.body;

        const user = userModel.findUser(loginUsername);

        if (!user || user.length == 0 || !bcrypt.compareSync(loginPassword, user[0]['userpassword'])){
            return res.status(401).json({message: 'Credenciales inválidas'});
        }

        const token = jwt.sign({id: user[0]['username']}, process.env.SECRET_KEY, {expiresIn: '15m'});

        res.status(201).json({token: token});
    } catch (error) {
        console.error(error.message);
        res.status(500).json({message: error.message});
    }
});
// Recibe en el body los parametros para crear un usuario
router.post('/register', async (req, res) => {
    printPath(req.path, req.method);

    try {
        const {newUsername, newhashedPassword, newUsertype} = req.body;
        const valid = await userModel.registerUser(newUsername, newhashedPassword, newUsertype);
        if (valid == 1)
            res.status(201).json({message: 'Usuario registrado correctamente'});
        else
            res.status(409).json({message: 'El usuario ya existe'});
    } catch (error) {
        console.log(error.message)
        res.status(500).json({message: error.message});
    }
});
// Ruta protegida, regresa todos los usuarios autenticados
router.get('/findAll', authenticateToken, authorizeRoles(['1']), async (req, res) => {
    printPath(req.path, req.method);

    try {
        const users = await userModel.findAllUsers();
        res.status(200).json(users);
            
    } catch (error) {
        console.error(error.message);
        res.status(500).json({message: error.message});
    }
});
// Ruta protegida para modificar usuarios
router.post('/updateUser', authenticateToken, authorizeRoles(['1']), async (req, res) =>{
    printPath(req.path, req.method);

    try {
        const {currentUsername, newHashedPassword, newUserType} = req.body;

        if (newHashedPassword){
            // Código para cambiar contraseña
        }
        if (newUserType){
            // Código para cambiar tipo de usuario
        }
        res.status(200).json({message: 'Usuario actualizado correctamente'});
    } catch (error) {
        console.error(error.message);
        res.status(500).json({message: error.message});
    }
});
module.exports = router;