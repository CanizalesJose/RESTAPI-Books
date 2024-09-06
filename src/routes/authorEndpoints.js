var router = require('express').Router();
var db = require('../connection/db');
/*
    Ejemplo de uso de consultas a base de datos
    try {
        const listAuthors = await db.query('SELECT * from author where authorId = ?', [req.params.authorId]);
        res.status(200).json(listAuthors);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error en la consulta a base de datos');
    }
 */

router.get('/', function(req, res) {
    res.status(200).json({message: 'Connected to Books, Resource: Author'})
});

router.get('/info', function(req, res){
    res.status(200).json({message: 'This section contains a list of authors for the books.'})
});

router.get('/get/:authorId', async function(req, res) {
    console.log(`${req.method} method on route "${req.path}"`);
    try {
        const authorQuery = await db.query('SELECT * from author where authorId = ?', [req.params.authorId]);
        console.log(authorQuery);
        if (authorQuery.length==0){
            res.status(204).json(null);
        }else{
            res.status(200).json(authorQuery);
        }
    } catch (ex) {
        console.error(ex.message);
        res.status(500).json([{message: 'An unexpected error ocurred'}]);
    }
});

router.get('/getall', async function(req, res) {
    console.log(`${req.method} method on route "${req.path}"`);
    try {
        const authorsQuery = await db.query('SELECT * FROM author');
        if (authorsQuery.length==0)
            res.status(204).json(null);
        else
            res.status(200).json(authorsQuery);
    } catch (ex) {
        console.error(ex.message);
        res.status(500).json([{message: 'An unexpected error ocurred'}]);
    }
});

router.use((req, res, next) =>{
    res.status(404).json([{message: "The requested route does not exists"}]);
});
module.exports = router;