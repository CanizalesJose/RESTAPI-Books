# Documentación
Esta API permite interactuar de forma sencilla con una base de datos. En este caso se simula una librería.

## ¿Como hacerlo funcionar?
La estructura del proyecto es la siguiente.
 - PrimerNODEJS (Carpeta raíz)
   - src (Carpeta del código fuente)
     - connection (Configuración de base de datos)
     - models (Data Access Objects)
     - routes (Endpoints)
   - app.js (Aplicación principal)
   - package.json (Paquetes npm)
   - npm-shrinkwrap.json (Version de los paquetes bloqueada)
   - README.md (Documentación generica)
   - CREATEDB.sql (Script para crear la base de datos por defecto)
   - swagger.yaml (Documentación dinámica)

Primero se deben instalar las dependencias usando
```
npm install
```

Para iniciar el servidor se puede usar `node` o `npm`:
```sh
node app.js
npm run dev
```
En caso de ejecutar el servidor para ponerlo a prueba se puede usar el primero. Esto lo lanzará pero no permitira que se actualice en tiempo real.
Al usar `npm run dev` se ejecuta el script `nodemon app.js` el cual permite ejecutar un entorno de desarrollo que vuelve a ejecutar el servicio al detectar un cambio en algun archivo.

### Pruebas con CURL
CURL es una herramienta que nos permite realizar peticiones HTTP desde una terminal. Viene como parte de la utilería básica de Linux y Windows.
Para usarla debemos usar una terminal y el comando `curl <options> <URL>`
Options:
- `--data <data>`: permite enviar datos en el body de la petición. La información debe tener el formato `"parametro1=valor1&parametro2=valor2"`
- `--header <data>`: permite enviar datos en el header de la petición. La información debe tener el formato `parametro: valor`
- `-x <METHOD>:` permite envíar una solicitud usando el método especificado, POST, GET, PATCH o DELETE.

#### Pendientes
- Aplicar inserts en DAO prestamos: newLoan
- DAO para prestamos
- Endpoints de prestamos
- Documentar endpoints de autores
- Documentar endpoints de usuarios
- Documentar endpoints de categorias
- Documentar endpoints de libros
- Documentar endpoints de libros