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
        if (error.sqlState)
            return res.status(500).json({message: 'Error interno en consulta'});
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

router.post('/register',authenticateToken, authorizeRoles(['admin']), async (req, res) => {
    printPath(req.path, req.method);
    const {newId, newTitle, newIsbn, newAuthor, newPublisher, newPublishYear, newCategory, newCopies, newImageUrl} = req.body;
    // Si no hay url de imagen, usa la predeterminada
    if (!newImageUrl)
        newImageUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT58P55blSKZmf2_LdBoU7jETl6OiB2sjYy9A&s';
    // Si falta al menos un otro argumento no se puede registrar
    if (!newId || !newTitle || !newIsbn || !newAuthor || !newPublisher || !newPublishYear || !newCategory || !newCopies){
        res.status(400).json({message: 'Faltan parametros'});
    }
    
});

router.use((req, res, next) =>{
    res.status(404).json([{message: `The requested route with method ${req.method} does not exists`}]);
});

module.exports = router;