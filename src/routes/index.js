// Se crea un objeto de tipo Router desde la libreria express
var router = require('express').Router();
// Se importan las rutas de cada elemento del router
// Cada ruta debe encontrarse en la carpeta 'src/routes'
// var [elemento] = require('[./elemento]');
var models = require('./models');
var materials = require('./materials');

// Por cada paquete de rutas de elemento se agrega un elemento al objeto Router
// router.use('/elemento', nombreVar);
router.use('/models', models);
router.use('/materials', materials);

// Crear rutas del sistema, propias de la base de la API
/*
  router.get('/ruta', function(req, res){
    res.status(200).json()
  });
 */
router.get('/', function (req, res) {
  console.log(`Acceso con método ${req.method} en dirección ${req.path}`);
  res.status(200).json({ message: 'Conexión a PrintOnDemand API' });
});

router.get('/');

module.exports = router;