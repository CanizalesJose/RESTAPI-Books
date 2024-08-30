# Documentación
Esta API permite interactuar de forma sencilla con una base de datos. En este caso se simula una librería.

## ¿Como hacerlo funcionar?
La estructura del proyecto es la siguiente.
 - PrimerNODEJS (Carpeta raíz)
   - node_modules (Modulos de NodeJS)
   - src (Carpeta del código fuente)
     - connection (Configuración de base de datos)
     - models (Objetos a nivel API)
     - routes (Endpoints y backend)
   - app.js (Iniciador principal)
   - package-lock.json (Configuración)
   - package.json (Configuración)
   - README.md (Documentación)

Para iniciar el servidor se puede usar `node` o `npm`:
```sh
node app.js
npm run dev
```
En caso de ejecutar el servidor para ponerlo a prueba se puede usar el primero. Esto lo lanzará pero no permitira que se actualice en tiempo real.
Al usar `npm run dev` se ejecuta el script `nodemon app.js` el cual permite ejecutar un entorno de desarrollo que vuelve a ejecutar el servicio al detectar un cambio en algun archivo.