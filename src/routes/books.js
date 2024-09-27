var router = require('express').Router();
const db = require('../connection/db');
const bookDAO = require('../models/bookDAO');
const {authenticateToken, authorizeRoles, printPath} = require('../utils');

router.get('/find', async (req, res) => {
    printPath(req.path, req.method);
    try {
        const {id} = req.body;
        const result = await bookDAO.find(id);
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

router.get('/findAll', async (req, res) => {
    printPath(req.path, req.method);
    try {
        const allBooks = await bookDAO.findAll();
        return res.status(200).json(allBooks);
    } catch (error) {
        if (error.sqlState)
            return res.status(500).json({message: 'Error interno en consulta'});
        const statusCode = error.statusCode || 500;
        return res.status(statusCode).json({message: error.message});
    }
});

router.post('/register', async (req, res) => {
    printPath(req.path, req.method);
    try{
        const {id, title, isbn, author, publisher, publishYear, category, copies, imageUrl} = req.body;
        await bookDAO.register(id, title, isbn, author, publisher, publishYear, category, copies, imageUrl);
        return res.status(201).json({message: "Libro registrado correctamente"});
    } catch (error) {
        if (error.sqlState)
            return res.status(500).json({message: "Error interno en consulta"});
        const statusCode = error.statusCode || 500;
        return res.status(statusCode).json({message: error.message});
    }
});

router.patch('/update', async (req, res) => {
    printPath(req.path, req.method);
    try{
        const {id, title, isbn, author, publisher, publishYear, category, copies, imageUrl} = req.body;
        await bookDAO.update(id, title, isbn, author, publisher, publishYear, category, copies, imageUrl);
        return res.status(200).json({message: "Libro actualizado"});
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

router.delete('/delete', async (req, res) => {
    printPath(req.path, req.method);
    try {
        const {id} = req.body;
        await bookDAO.delete(id);
        return res.status(200).json({message: "Registro eliminado"});
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
router.use((req, res, next) =>{
    res.status(404).json([{message: `The requested route with method ${req.method} does not exists`}]);
});

module.exports = router;