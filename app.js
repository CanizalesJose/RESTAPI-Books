require('dotenv').config();
// Importar las librerias necesarias
const express = require('express');
const db = require('./src/connection/db');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');
const app = express();

// Middleware para recuperar datos del post
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Recuperar puerto de las variables de entorno o usar 5000 por defecto
const port = process.env.PORT || 5000;
const host = process.env.HOST || 'localhost';
// Generar middleware para documentación
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'BooksCenter API',
            version: '24.09.24.8',
            description: 'Una API para la aplicación BooksCenter'
    },
    servers: [
        {
        url: `http://${host}:${port}`,
        },
    ],
    },
    apis: ['./docs/usersDocs.yaml', './docs/authorsDocs.yaml']
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);

// Se importan las rutas desde la carpeta routes
var router = require('./src/routes');
// Se asigna una ruta raíz para la API y de donde sacará las rutas
app.use('/api', router);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Se inicia el servidor en el puerto indicado
app.listen(port);
console.log(`API escuchando en http://${host}:${port}`);

process.on('SIGINT', async () => {
    await db.closePool();
    process.exit(0);
});