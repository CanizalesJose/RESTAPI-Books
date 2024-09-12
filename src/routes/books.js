var router = require('express').Router();
const db = require('../connection/db');

router.get('/getBook', function(req, res) {
    console.log(`${req.method} on route "${req.path}"`);
    res.status(200).json([{message: 'Esta ruta permite buscar un libro por su ID'}]);
});

router.get('/getBook/:bookId', async function(req, res) {
    console.log(`${req.method} method on route "${req.path}"`);
    try{
        const bookQuery = await db.query('SELECT * FROM books where bookId = ?', [req.params.bookId]);

        if (bookQuery.length == 0)
            res.status(204).json(null);
        else
            res.status(200).json(bookQuery);
    } catch(ex){
        console.error(ex.message);
        res.status(500).json([{message: 'An unexpected error ocurred'}]);
    }
});

router.use((req, res, next) =>{
    res.status(404).json([{message: `The requested route with method ${req.method} does not exists`}]);
});

module.exports = router;