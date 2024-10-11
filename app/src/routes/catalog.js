var router = require('express').Router();
const {authenticateToken, authorizeRoles, printPath} = require('../utils');
const catalogDAO = require('../models/catalogDAO');

router.post('/add', authenticateToken, authorizeRoles(['admin']), async (req, res) => {
    try {
        printPath(req.path, req.method);
        const {bookId, summary, isVisible} = req.body;
        await catalogDAO.addBook(bookId, summary, isVisible);
        return res.status(200).json({message: 'Libro agregado al catalogo'});
    } catch (error) {
        const statusCode = error.statusCode || 500;
        return res.status(statusCode).json({message: error.message});
    }
});

router.patch('/makeVisible/:id/:bookId', authenticateToken, authorizeRoles(['admin']), async (req, res) => {
    try {
        printPath(req.patch, req.method);
        const id = req.params.id;
        const bookId = req.params.bookId;
        
    } catch (error) {
        const statusCode = error.statusCode || 500;
        return res.status(statusCode).json({message: error.message});
    }
});

router.use((req, res, next) =>{
    res.status(404).json([{message: `The requested route with method ${req.method} does not exists`}]);
});

module.exports = router;