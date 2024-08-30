// Importar las librerias necesarias
var express = require('express');
var app = express();

// Se asigna un puerto para el servidor
var port = process.env.PORT || 5000;

// Se importan las rutas desde la carpeta routes
var router = require('./src/routes');
// Se asigna una ruta raíz para la API y de donde sacará las rutas
app.use('/api', router);

// Se inicia el servidor en el puerto establecido
app.listen(port);
console.log('API escuchando en el puerto ' + port);