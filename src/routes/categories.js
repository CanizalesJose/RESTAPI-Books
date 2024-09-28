const router = require('express').Router();
const categoryDAO = require('../models/categoryDAO');
const { authenticateToken, authorizeRoles, printPath } = require('../utils');
// Ruta protegida que regresa todas las categorias registradas, regresa [] si no encuentra nada o hay error en la consulta
router.get('/findAll', authenticateToken, authorizeRoles(['admin']), async (req, res) => {
    printPath(req.path, req.method);
    try {
        const categories = await categoryDAO.findAll();
        return res.status(200).json(categories);
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
// Ruta protegida para generar una nueva categoría
router.post('/register/:id', authenticateToken, authorizeRoles(['admin']), async (req, res) => {
    printPath(req.path, req.method);
    try {
        const id = req.params.id;
        const {descr} = req.body;
        await categoryDAO.register(id, descr);
        return res.status(200).json({message: 'Categoria creado correctamente'});
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
// Ruta protegida para actualizar una categoria
router.patch('/update/:id', authenticateToken, authorizeRoles(['admin']), async (req, res) => {
    printPath(req.path, req.method);
    try {
        const id = req.params.id;
        const {descr} = req.body;
        await categoryDAO.update(id, descr);
        return res.status(201).json({message: 'Categoria fue actualizada correctamente'});
    }catch(error) {
        if (error.sqlState){
            if (error.errno == 1451)
                return res.status(400).json({message: "No se puede eliminar dado que forma parte de otro registro"});
            return res.status(500).json({message: 'Error interno en consulta'});
        }
        const statusCode = error.statusCode || 500;
        return res.status(statusCode).json({message: error.message});
    }
});
// Ruta protegida para eliminar una categoría
router.delete('/delete/:id', authenticateToken, authorizeRoles(['admin']), async (req, res) => {
    printPath(req.path, req.method);
    try {
        const id = req.params.id;
        await categoryDAO.delete(id);
        return res.status(200).json({message: 'Categoria eliminada'});
    }catch(error) {
        if (error.sqlState){
            if (error.errno == 1451)
                return res.status(400).json({message: "No se puede eliminar dado que forma parte de otro registro"});
            return res.status(500).json({message: 'Error interno en consulta'});
        }
        const statusCode = error.statusCode || 500;
        return res.status(statusCode).json({message: error.message});
    }
});
// Ruta por defecto en caso de no existir la solicitada
router.use((req, res, next) =>{
    return res.status(404).json([{message: `The requested route with method ${req.method} does not exists`}]);
});

module.exports = router;