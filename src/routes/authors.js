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
    res.status(200).json({message: 'Este apartado permite buscar autores en base a ciertos parámetros.'})
});

router.get('/getById', async function(req, res) {
    console.log(`${req.method} on route "${req.path}"`);
    res.status(200).json([{message: 'Esta ruta permite encontrar autores en base a su ID'}]);
});

// Ruta para encontrar autores con su ID
router.get('/getByid/:authorId', async function(req, res) {
    console.log(`${req.method} on route "${req.path}"`);
    try {
        const authorQuery = await db.query('SELECT * from authors where authorId = ?', [req.params.authorId]);
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

router.get('/getByName', async function(req, res) {
    console.log(`${req.method} on route "${req.path}"`);
    res.status(200).json([{message: 'Esta ruta permite encontrar autores cuyo nombre incluya una cadena, regresa tantos como encuentre'}]);
});

// Ruta para encontrar autores cuyo nombre contenga un String
router.get('/getByName/:authorName', async function(req, res) {
    console.log(`${req.method} on route "${req.path}"`);
    try {
        const authorsQuery = await db.query('SELECT * FROM authors WHERE authorName LIKE ?', [`%${req.params.authorName}%`]);
        if (authorsQuery.length==0)
            res.status(204).send(null);
        else
        res.status(200).json(authorsQuery);
    } catch (ex) {
        console.error(ex.message);
        res.status(500).json([{message: 'An unexpected error ocurred'}]);
    }
});

router.get('/getByCategory', async function(req, res) {
    console.log(`${req.method} on route "${req.path}"`);
    res.json([{message: "Esta ruta permite buscar un autor que haya escrito libros de una categoría especifica"}]);
});

// Ruta para encontrar autores que tengan libros con una categoría especifica
router.get('/getByCategory/:bookCategory', async function(req, res) {
    console.log(`${req.method} method on route "${req.path}"`);
    try {
        const authorsQuery = await db.query('select authorId, authorName, authorNationality from authors inner join books on authors.authorid=books.bookauthor inner join categories on books.bookcategory=categories.categoryid where categoryid = ? group by authorid;', [req.params.bookCategory]);
        if (authorsQuery.length==0)
            res.status(204).send(null);
        else
            res.status(200).json(authorsQuery);
    } catch (ex) {
        console.error(ex.message);
        res.status(500).json([{message: "An unexpected error ocurred"}]);
    }
});

// Regresa todos los autores en base de datos
router.get('/getall', async function(req, res) {
    console.log(`${req.method} on route "${req.path}"`);
    try {
        const authorsQuery = await db.query('SELECT * FROM authors');
        if (authorsQuery.length==0)
            res.status(204).json(null);
        else
            res.status(200).json(authorsQuery);
    } catch (ex) {
        console.error(ex.message);
        res.status(500).json([{message: 'An unexpected error ocurred'}]);
    }
});

router.post('/postAuthor', async function(req, res){
    console.log(`${req.method} on route "${req.path}"`);
    try {
        const newAuthor = JSON.parse(req.body);
        console.log(newAuthor);
        req.status(200).send("Done!");
    } catch (ex) {
        console.error(ex.message);
        res.status(500).json([{message: "An unexpected error ocurred"}]);
    }
});

router.use((req, res, next) =>{
    res.status(404).json([{message: `The requested route with method ${req.method} does not exists`}]);
});
module.exports = router;