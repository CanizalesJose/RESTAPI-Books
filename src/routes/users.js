const router = require('express').Router();
const userDAO = require('../models/userDAO');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { authenticateToken, authorizeRoles, printPath, encryptText } = require('../utils');

// Recibe en el body un username y password, regresa 201 y el token generado si el usuario existe
router.post('/login', async (req, res) => {
    printPath(req.path, req.method);

    try {
        const {loginUsername, loginPassword} = req.body;

        const user = await userDAO.findUser(loginUsername);

        if (!user || user.length == 0 || !bcrypt.compareSync(loginPassword, user[0]['userpassword'])){
            return res.status(401).json({message: 'Credenciales inválidas'});
        }

        const token = jwt.sign({username: user[0]['username'], usertype: user[0]['usertype']}, process.env.SECRET_KEY, {expiresIn: '20m'});

        return res.status(201).json({token: token, username: user[0]['username'], usertype: user[0]['usertype']});
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({message: error.message});
    }
});
// Recibe en el body un usuario y contraseña en texto plano
router.post('/register', async (req, res) => {
    printPath(req.path, req.method);

    try {
        const {newUsername, newPassword, newUsertype} = req.body;
        const newHashedPassword = await encryptText(newPassword);
        const valid = await userDAO.registerUser(newUsername, newHashedPassword, newUsertype);
        if (valid == 0)
            return res.status(201).json({message: 'Usuario registrado correctamente'});
        else
            return res.status(409).json({message: 'El usuario ya existe'});
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({message: error.message});
    }
});
// Ruta protegida, regresa todos los usuarios autenticados
router.get('/findAll', authenticateToken, authorizeRoles(['admin']), async (req, res) => {
    printPath(req.path, req.method);

    try {
        const users = await userDAO.findAllUsers();
        return res.status(200).json(users);
            
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({message: error.message});
    }
});
// Ruta protegida para modificar usuarios
router.patch('/update', authenticateToken, authorizeRoles(['admin']), async (req, res) =>{
    printPath(req.path, req.method);

    try {
        const {changedUser, newPassword, newUsertype} = req.body;
        
        var changes = 'Datos cambiados: ';
        // Revisar body de la petición
        if (!changedUser){
            return res.status(400).json({message: 'El usuario actualizado no se ha recibido'});
        }
        if (!newPassword && !newUsertype){
            return res.status(400).json({message: 'Se debe mandar por lo menos una nueva contraseña o un nuevo tipo de usuario'});
        }
        // Comprobar requisitos de datos
        if (newPassword && (newPassword.length > 100 || newPassword.length == 0)){
            return res.status(400).json({message: 'La contraseña no puede estar vacía ni ser mayor a 100 caracteres'});
        }
        if (newUsertype && (newUsertype != "admin" && newUsertype != "client")){
            return res.status(400).json({message: 'El tipo de usuario debe ser "admin o "client"'});
        }
        // Actualizar datos
        var changed = 1;
        if (newPassword){
            // Actualizar contraseña
            changed = await userDAO.updatePassword(encryptText(newPassword), changedUser);
            if (changed == 1)
                changes += 'hubo un error actualizando contraseña '
            else
                changes += 'contraseña ';
            changed = 1;
        }
        if (newUsertype){
            // Actualizar tipo de usuario
            changed = await userDAO.updateUsertype(newUsertype, changedUser);
            if (changed == 1)
                changes += 'hubo un error actualizando el tipo de usuario '
            else
                changes += 'usertype';
        }
        return res.status(201).json({message: `Usuario actualizado correctamente. ${changes}`});
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({message: error.message});
    }
});
// Ruta protegida para eliminar usuarios
router.delete('/delete', authenticateToken, authorizeRoles(['admin']), async (req, res) => {
    printPath(req.path, req.method);
    const {deletedUsername} = req.body;
    if (!deletedUsername)
        return res.status(400).json({message: 'Se debe enviar un nombre de usuario'});
    try {
        const valid = await userDAO.deleteUser(deletedUsername);
        if (valid == 1)
            return res.status(500).json({message: 'Ocurrió un error al eliminar el usuario'});
        if (valid == 0)
            return res.status(200).json({message: 'Usuario eliminado con éxito'});
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({message: error.message});
    }
});
// Middleware para gestionar rutas no existentes
router.use((req, res, next) =>{
    return res.status(404).json([{message: `The requested route with method ${req.method} does not exists`}]);
});
module.exports = router;