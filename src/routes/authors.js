const router = require('express').Router();
const authorDAO = require('../models/authorDAO');
const { authenticateToken, authorizeRoles, printPath } = require('../utils');
// Ruta protegida para buscar un autor
router.get('/find', authenticateToken, authorizeRoles(['admin']), async (req, res) => {
    printPath(req.path, req.method);
    const {id} = req.body;
    try {
        const result = await authorDAO.find(id);
        return res.status(200).json(result);
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
// Ruta protegida para regresar todos los autores
router.get('/findAll', authenticateToken, authorizeRoles(['admin']), async (req, res) => {
    printPath(req.path, req.method);
    try {
        const results = await authorDAO.findAll();
        return res.status(200).json(results);
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
// Ruta protegida para registrar un nuevo autor
router.post('/register', authenticateToken, authorizeRoles(['admin']), async (req, res) => {
    printPath(req.path, req.method);
    const {newId, newFullname, newNationality} = req.body;
    try {
        await authorDAO.register(newId, newFullname, newNationality);
        return res.status(200).json({message: 'Autor registrado'});
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
// Ruta para actualizar un registro
router.patch('/update', authenticateToken, authorizeRoles(['admin']), async (req, res) => {
    printPath(req.path, req.method);
    const {id, newFullname, newNationality} = req.body;
    try {
        await authorDAO.update(id, newFullname, newNationality);
        return res.status(200).json({message: 'Autor actualizado'});
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
// Ruta para eliminar un registro
router.delete('/delete'/* , authenticateToken, authorizeRoles(['admin']) */, async (req, res) => {
    printPath(req.path, req.method);
    const {id} = req.body;
    try {
        await authorDAO.delete(id);
        return res.status(200).json({message: 'Autor eliminado'});
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
// Ruta por defecto cuando se hace una solicitud a una ruta no definida
router.use((req, res, next) =>{
    res.status(404).json([{message: `The requested route with method ${req.method} does not exists`}]);
});
module.exports = router;