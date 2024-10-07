// Se crea un objeto de tipo Router desde la libreria express
const router = require('express').Router();
const {printPath} = require('../utils');
// Se importan las rutas de cada elemento del router
// Cada ruta debe encontrarse en la carpeta 'src/routes'
// var [elemento] = require('[./elemento]');
const users = require('./users');
const categories = require('./categories');
// Pendientes
const authors = require('./authors');   /* Dar revisión */
const books = require('./books');

// Por cada paquete de rutas se agrega una raíz al objeto Router
// router.use('/rutaRaíz', rutas);
// De forma práctica, esta es la ruta raiz para cada archivo de ruta
router.use('/users', users);
router.use('/categories', categories);
router.use('/authors', authors);
router.use('/books', books);

// Crear rutas del sistema, propias de la base de la API
router.get('/', async function (req, res) {
  printPath(req.path, req.method);
  res.sendStatus(200);
});

router.get('/');

module.exports = router;