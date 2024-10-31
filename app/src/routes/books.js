var router = require('express').Router();
const bookDAO = require('../models/bookDAO');
const {authenticateToken, authorizeRoles, printPath} = require('../utils');

router.get('/find/:id', authenticateToken, authorizeRoles(['admin']), async (req, res) => {
    printPath(req.originalUrl, req.method);
    try {
        const id = req.params.id;
        const book = await bookDAO.find(id);
        return res.status(200).json(book);
    } catch (error) {
        if (error.sqlState){
            console.log(error);
            return res.status(500).json({message: 'Error interno en consulta'});
        }
        const statusCode = error.statusCode || 500;
        return res.status(statusCode).json({message: error.message});
    }
})

router.get('/findAll', async (req, res) => {
    printPath(req.originalUrl, req.method);
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

router.get('/find/title/:title', authenticateToken, authorizeRoles(['admin']), async (req, res) => {
    printPath(req.originalUrl, req.method);
    try {
        const title = req.params.title;
        const results = await bookDAO.findTitle(title);
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

router.post('/register', authenticateToken, authorizeRoles(['admin']), async (req, res) => {
    printPath(req.originalUrl, req.method);
    try{
        const {title, isbn, author, publisher, publishYear, category, copies, imageUrl} = req.body;
        const newBook = await bookDAO.register(title, isbn, author, publisher, publishYear, category, copies, imageUrl);
        return res.status(201).json({
            message: "Libro registrado correctamente",
            book: newBook
        });
    } catch (error) {
        if (error.sqlState)
            return res.status(500).json({message: "Error interno en consulta"});
        const statusCode = error.statusCode || 500;
        return res.status(statusCode).json({message: error.message});
    }
});

router.patch('/update/:id', authenticateToken, authorizeRoles(['admin']), async (req, res) => {
    printPath(req.originalUrl, req.method);
    try{
        const id = req.params.id;
        const {title, isbn, author, publisher, publishYear, category, copies, imageUrl} = req.body;
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

router.delete('/delete/:id', authenticateToken, authorizeRoles(['admin']), async (req, res) => {
    printPath(req.originalUrl, req.method);
    try {
        const id = req.params.id;
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