var router = require('express').Router();
const {authenticateToken, authorizeRoles, printPath} = require('../utils');
const catalogDAO = require('../models/catalogDAO');

router.get('/fetchNotInCatalog', authenticateToken, authorizeRoles(['admin']), async (req, res) => {
    try {
        printPath(req.originalUrl, req.method);
        return res.status(200).json(await catalogDAO.fetchNotInCatalog());
    } catch (error) {
        const statusCode = error.statusCode || 500;
        return res.status(statusCode).json({message: error.message});
    }
});

router.get('/fetchCatalog', authenticateToken, authorizeRoles(['admin']), async (req, res) => {
    try {
        printPath(req.originalUrl, req.method);
        return res.status(200).json(await catalogDAO.fetchInCatalog());
    } catch (error) {
        const statusCode = error.statusCode || 500;
        return res.status(statusCode).json({message: error.message});
    }
});

router.get('/fetchVisibleCatalog', async (req, res) => {
    try {
        printPath(req.originalUrl, req.method);
        return res.status(200).json(await catalogDAO.fetchVisibleCatalog());
    } catch (error) {
        const statusCode = error.statusCode || 500;
        return res.status(statusCode).json({message: error.message});
    }
});

router.get('/fetchTopLoans', async (req, res) => {
    try {
        printPath(req.originalUrl, req.method);
        return res.status(200).json(await catalogDAO.fetchTopLoans());
    } catch (error) {
        const statusCode = error.statusCode || 500;
        return res.status(statusCode).json({message: error.message});
    }
});

router.get('/fetchByTitle/:title', async (req, res) => {
    try {
        printPath(req.originalUrl, req.method);
        const title = req.params.title;
        return res.status(200).json(await catalogDAO.fetchByTitle(title));
    } catch (error) {
        const statusCode = error.statusCode || 500;
        return res.status(statusCode).json({message: error.message});
    }
});

router.post('/add/:bookId', authenticateToken, authorizeRoles(['admin']), async (req, res) => {
    try {
        printPath(req.originalUrl, req.method);
        const bookId = req.params.bookId;
        const {summary, isVisible} = req.body;
        await catalogDAO.addBook(bookId, summary, isVisible);
        return res.status(200).json({message: 'Libro agregado al catalogo'});
    } catch (error) {
        const statusCode = error.statusCode || 500;
        return res.status(statusCode).json({message: error.message});
    }
});

router.patch('/editSummary/:id/:bookId', authenticateToken, authorizeRoles(['admin']), async (req, res) => {
    try {
        printPath(req.originalUrl, req.method);
        const id = req.params.id;
        const bookId = req.params.bookId;
        const { summary } = req.body;
        // Actualizar desde el dao
        await catalogDAO.editSummary(id, bookId, summary);
        return res.status(200).json({message: 'Sinopsis actualizada'});
    } catch (error) {
        const statusCode = error.statusCode || 500;
        return res.status(statusCode).json({message: error.message});
    }
});

router.delete('/remove/:id/:bookId', authenticateToken, authorizeRoles(['admin']), async (req, res) => {
    try {
        printPath(req.originalUrl, req.method);
        const id = req.params.id;
        const bookId = req.params.bookId;
        return res.status(200).json({message: await catalogDAO.remove(id, bookId)});
    } catch (error) {
        const statusCode = error.statusCode || 500;
        return res.status(statusCode).json({message: error.message});
    }
});

router.patch('/makeVisible/:id/:bookId', authenticateToken, authorizeRoles(['admin']), async (req, res) => {
    try {
        printPath(req.originalUrl, req.method);
        const id = req.params.id;
        const bookId = req.params.bookId;
        await catalogDAO.makeVisible(id, bookId);
        return res.status(200).json({message: 'Actualizado'});
    } catch (error) {
        const statusCode = error.statusCode || 500;
        return res.status(statusCode).json({message: error.message});
    }
});

router.patch('/makeNotVisible/:id/:bookId', authenticateToken, authorizeRoles(['admin']), async (req, res) => {
    try {
        printPath(req.originalUrl, req.method);
        const id = req.params.id;
        const bookId = req.params.bookId;
        await catalogDAO.makeNotVisible(id, bookId);
        return res.status(200).json({message: 'Actualizado'});
    } catch (error) {
        const statusCode = error.statusCode || 500;
        return res.status(statusCode).json({message: error.message});
    }
});

router.use((req, res, next) =>{
    res.status(404).json([{message: `The requested route with method ${req.method} does not exists`}]);
});

module.exports = router;