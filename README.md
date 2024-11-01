## BooksCenter API

Se trata de un sistema para la gestión de una biblioteca en Node JS usando el framework Express.

Entre las capacidades del servidor están:
- Gestionar usuarios, dar altas, bajas y modificaciones de usuarios particulares, así como inicios de sesión y autenticación mediante JWT
- Gestionar categorías a las que pueden pertenecer un libro.
- Gestionar autores de los libros
- Gestionar los libros en sí, asignandoles autor y categoría
- Gestión de prestamos (en desarrollo)

### Configuraciones

Para ejecutar el programa sin problemas, se presentan a continuación distintas configuraciones e instalaciones necesarias:

#### Requisitos previos

El programa fue desarrollado usando las siguientes versiones:

- Node JS v20.15.0
- npm v10.7.0
- Docker v27.2.0, build  3ab4256
- Docker-Compose v2.29.2-desktop.2
- WSL v2.3.24.0
- MySQL v8.2.0

En una máquina Windows 10.0.19045.4894

#### Instalación local

Para instalar el programa localmente se debe clonar el repositorio ya sea descargando el código directamente o usando:
```sh
git clone https://github.com/CanizalesJose/RESTAPI-Books.git
```

Una vez en la dirección del repositorio se debe inicializar la base de datos en MySQL. Para ello cargamos el script `CREATEDB.sql` de la terminal de mysql en usuario root.

```sql
source CREATEDB.sql;
```

Si bien, el programa ya está listo para correr, es vital saber que existen una serie de variables de entorno que se pueden configurar. A continuación se muestran estas variables y su valor predeterminado:

```
PORT=5000
HOST=localhost
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=1234
DB_NAME=booksCenter
SECRET_KEY=test
```

Estas variables se pueden declara en un archivo `.env` dentro de la carpeta `app/`.

El siguiente paso es instalar las dependencias. Dirigirse a la dirección `app/` y ejecutar:
```sh
npm install
```

Hay dos formas de iniciar el sistema, en modo desarrollo y prueba. El modo desarrollo reinicia el servicio cada vez que se detecta un cambio en el codigo fuente. En el modo prueba no ocurre esto.
```sh
node app.js
npm run dev
```

#### Instalación con Dockers
En caso de ser necesario, configurar el archivo `docker-compose.yml` con las variables de entorno necesarias u otra configuración adicional.

```sh
docker-compose up --build
```

Este comando debería iniciar los procesos necesarios para crear las imágenes de la base de datos y la propia aplicación.


### Pruebas con CURL
CURL es una herramienta que nos permite realizar peticiones HTTP desde una terminal. Viene como parte de la utilería básica de Linux y Windows.
Para usarla debemos usar una terminal y el comando `curl <options> <URL>`
Options:
- `--data <data>`: permite enviar datos en el body de la petición. La información debe tener el formato `"parametro1=valor1&parametro2=valor2"`
- `--header <data>`: permite enviar datos en el header de la petición. La información debe tener el formato `parametro: valor`
- `-x <METHOD>:` permite envíar una solicitud usando el método especificado, POST, GET, PATCH o DELETE.

#### Pendientes
- Documentación de endpoints