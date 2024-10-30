// Se crea un objeto de tipo Router desde la libreria express
const router = require('express').Router();
const {printPath} = require('../utils');
// Se importan las rutas de cada elemento del router
// Cada ruta debe encontrarse en la carpeta 'src/routes'
// var [elemento] = require('[./elemento]');
const users = require('./users');
const categories = require('./categories');
const authors = require('./authors');
const books = require('./books');
const loans = require('./loans');
const catalog = require('./catalog');

// Por cada paquete de rutas se agrega una raíz al objeto Router
// router.use('/rutaRaíz', rutas);
// De forma práctica, esta es la ruta raiz para cada archivo de ruta
router.use('/users', users);
router.use('/categories', categories);
router.use('/authors', authors);
router.use('/books', books);
router.use('/loans', loans);
router.use('/catalog', catalog);

// Crear rutas del sistema, propias de la base de la API
router.get('/', async function (req, res) {
  printPath(req.path, req.method);
  return res.status(200).json({message: 'Working'});
});

router.get('/');

module.exports = router;