// Se crea un objeto de tipo Router desde la libreria express
var router = require('express').Router();
// Se importan las rutas de cada elemento del router
// Cada ruta debe encontrarse en la carpeta 'src/routes'
// var [elemento] = require('[./elemento]');
var authors = require('./authorEndpoints');

// Por cada paquete de rutas de elemento se agrega una raíz al objeto Router
// router.use('/rutaRaíz', variableRutas);
// De forma práctica, esta es la ruta raiz para cada archivo de ruta
router.use('/authors', authors);

// Crear rutas del sistema, propias de la base de la API
/*
  router.get('/ruta', function(req, res){
    res.status(200).json()
  });
 */
router.get('/', function (req, res) {
  console.log(`Acceso con método ${req.method} en dirección ${req.path}`);
  res.status(200).json({ message: 'Conexión a Books API' });
});

router.get('/');

module.exports = router;