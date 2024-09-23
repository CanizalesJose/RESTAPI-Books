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
        return res.status(500).json({message: error.message});
    }
});
// Ruta protegida para generar una nueva categoría
router.post('/register', authenticateToken, authorizeRoles(['admin']), async (req, res) => {
    printPath(req.path, req.method);
    const {newId, newDescr} = req.body;
    try {
        if (!newId || !newDescr)
            throw new Error("Faltan parametros en la solicitud");
        if (newId.length == 0 || newId.length > 15)
            throw new Error("El nuevo ID no cumple los requisitos");
        if (newDescr.length == 0 || newDescr.length > 100)
            throw new Error("La nueva descripción no cumple los requisitos");
        await categoryDAO.register(newId, newDescr);
        return res.status(200).json({message: 'Categoria creado correctamente'});
    } catch (error) {
        return res.status(400).json({message: error.message});
    }
});
// Ruta protegida para actualizar una categoria
router.patch('/update', authenticateToken, authorizeRoles(['admin']), async (req, res) => {
    printPath(req.path, req.method);
    const {updatedId, newDescr} = req.body;
    if (!updatedId || !newDescr)
        return res.status(400).json({message: 'Faltan parámetros en la solicitud'});
    try {
        const result = await categoryDAO.update(updatedId, newDescr);

        if (result == 0)
            return res.status(201).json({message: 'Categoria fue actualizada correctamente'});
    }catch(error) {
        return res.status(500).json({message: error.message});
    }
});
// Ruta protegida para eliminar una categoría
router.delete('/delete', authenticateToken, authorizeRoles(['admin']), async (req, res) => {
    printPath(req.path, req.method);
    const {deletedId} = req.body;
    if (!deletedId)
        return res.status(400).json({message: 'Faltan parametros'});
    try {
        const result = await categoryDAO.delete(deletedId);
        return res.status(200).json({message: 'Categoria eliminada'});
    }catch(error) {
        return res.status(500).json({message: error.message});
    }
});
// Ruta por defecto en caso de no existir la solicitada
router.use((req, res, next) =>{
    return res.status(404).json([{message: `The requested route with method ${req.method} does not exists`}]);
});

module.exports = router;