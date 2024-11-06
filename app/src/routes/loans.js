const router = require('express').Router();
const loanDAO = require('../models/loansDAO');
const { authenticateToken, authorizeRoles, printPath } = require('../utils');

router.post('/new', authenticateToken, async (req, res) => {
    try {
        printPath(req.originalUrl, req.method);
        const { booksList } = req.body;
        const username = req.user.username;
        await loanDAO.newLoan(booksList, username);
        return res.sendStatus(201);
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

router.get('/fetchByID/:id', authenticateToken, authorizeRoles(['admin']), async (req, res) => {
    try {
        printPath(req.originalUrl, req.method);
        const id = req.params.id;
        return res.status(200).json(await loanDAO.fetchById(id));
    } catch (error) {
        const statusCode = error.statusCode || 500;
        return res.status(statusCode).json({message: error.message});
    }
});

router.get('/fetchByUser', authenticateToken, async (req, res) => {
    try {
        printPath(req.originalUrl, req.method);
        const username = req.user.username;
        return res.status(200).json(await loanDAO.fetchByUser(username));
    } catch (error) {
        const statusCode = error.statusCode || 500;
        return res.status(statusCode).json({message: error.message});
    }
});

router.get('/fetchReturned', authenticateToken, authorizeRoles(['admin', 'worker']), async (req, res) => {
    try {
        printPath(req.originalUrl, req.method);
        return res.status(200).json(await loanDAO.fetchReturned());
    } catch (error) {
        const statusCode = error.statusCode || 500;
        return res.status(statusCode).json({message: error.message});
    }
});

router.get('/fetchReturned/:title', authenticateToken, authorizeRoles(['admin', 'worker']), async (req, res) => {
    try {
        printPath(req.originalUrl, req.method);
        const title = req.params.title;
        return res.status(200).json(await loanDAO.fetchReturnedByTitle(title));
    } catch (error) {
        const statusCode = error.statusCode || 500;
        return res.status(statusCode).json({message: error.message});
    }
});

router.get('/fetchPending', authenticateToken, authorizeRoles(['admin', 'worker']), async (req, res) => {
    try {
        printPath(req.originalUrl, req.method);
        return res.status(200).json(await loanDAO.fetchPending());
    } catch (error) {
        const statusCode = error.statusCode || 500;
        return res.status(statusCode).json({message: error.message});
    }
});

router.get('/fetchPending/:title', authenticateToken, authorizeRoles(['admin', 'worker']), async (req, res) => {
    try {
        printPath(req.originalUrl, req.method);
        const title = req.params.title;
        return res.status(200).json(await loanDAO.fetchPendingByTitle(title));
    } catch (error) {
        const statusCode = error.statusCode || 500;
        return res.status(statusCode).json({message: error.message});
    }
});

router.get('/fetchByUser/:username', authenticateToken, authorizeRoles(['admin']), async (req, res) => {
    try {
        printPath(req.originalUrl, req.method);
        const username = req.params.username;
        return res.status(200).json(await loanDAO.findFromUser(username));
    } catch (error) {
        const statusCode = error.statusCode || 500;
        return res.status(statusCode).json({message: error.message});
    }
});

router.patch('/update/:loanId/:bookId/:newStatus', authenticateToken, authorizeRoles(['admin', 'worker']), async (req, res) => {
    try {
        printPath(req.originalUrl, req.method);
        const loanId = req.params.loanId;
        const bookId = req.params.bookId;
        const newStatus = req.params.newStatus;
        await loanDAO.updateReturn(newStatus, loanId, bookId);
        return res.sendStatus(200);

    } catch (error) {
        const statusCode = error.statusCode || 500;
        return res.status(statusCode).json({message: error.message});
    }
});

router.use((req, res, next) =>{
    return res.status(404).json([{message: `The requested route with method ${req.method} does not exists`}]);
});
module.exports = router;