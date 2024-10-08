const router = require('express').Router();
const loanDAO = require('../models/loansDAO');
const { authenticateToken, authorizeRoles, printPath } = require('../utils');

router.post('/register', authenticateToken, async (req, res) => {
    try {
        printPath(req.path, req.method);
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

router.get('/findAll', authenticateToken, authorizeRoles(['admin']), async (req, res) => {
    try {
        printPath(req.path, req.method);
        
        return res.status(200).json(await loanDAO.findAll());
    } catch (error) {
        const statusCode = error.statusCode || 500;
        return res.status(statusCode).json({message: error.message});
    }
});

router.use((req, res, next) =>{
    return res.status(404).json([{message: `The requested route with method ${req.method} does not exists`}]);
});
module.exports = router;