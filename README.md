## BooksCenter API

Se trata de un sistema para la gestión de una biblioteca en Node JS usando el framework Express.

Entre las capacidades del servidor están:
- Gestión de usuarios, dar altas, bajas y modificaciones de usuarios particulares, así como inicios de sesión y autenticación mediante JWT
- Gestión de categorías a las que puede pertenecer un libro.
- Gestión de autores de los libros
- Gestión de libros
- Gestión de catálogo
- Gestión de prestamos

### Configuraciones

Para ejecutar el programa sin problemas, se presentan a continuación distintas configuraciones e instalaciones necesarias:

#### Requisitos previos

El programa fue desarrollado usando las siguientes versiones:

Para un entorno local:
- Node JS v20.15.0
- npm v10.7.0
- MySQL v8.2.0

En caso de usar Docker:
- Docker v27.2.0, build  3ab4256
- Docker-Compose v2.29.2-desktop.2
- WSL v2.3.24.0

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

Si bien, el programa ya está listo para correr, es vital saber que existe una serie de variables de entorno que se pueden configurar. A continuación se muestran estas variables y su valor predeterminado:

```yml
# Puerto que responde a la API
PORT=5000
# La dirección que atiende la API
HOST=localhost
# La dirección donde se encuentra la base de datos
DB_HOST=localhost
# El usuario que maneja la base de datos
DB_USER=root
# Contraseña del usuario de la base de datos
DB_PASSWORD=1234
# Nombre de la base de datos
DB_NAME=booksCenter
# Firma secreta de la API para la generación de Tokens
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

Si se realiza cualquier cambio en el proyecto, se va a necesitar volver a crear las imagenes para ambos contenedores. Para ello se ejecutan los comandos:

```sh
docker-compose down --volumes --remove-orphans
docker rmi mysql restapi-books-api
```


### Pruebas con CURL
CURL es una herramienta que nos permite realizar peticiones HTTP desde una terminal. Viene como parte de la utilería básica de Linux y Windows.
Para usarla debemos usar una terminal y el comando `curl <options> <URL>`
Options:
- `--data <data>`: permite enviar datos en el body de la petición. La información debe tener el formato `"parametro1=valor1&parametro2=valor2"`
- `--header <data>`: permite enviar datos en el header de la petición. La información debe tener el formato `parametro: valor`
- `-x <METHOD>:` permite envíar una solicitud usando el método especificado, POST, GET, PATCH o DELETE.

### Pruebas desde documentación
A través de la ruta estática http://dirección-api/api-docs/ es posible entrar a la documentación integrada donde se encuentra una explicación del proceso que reliza cada endpoint.

Además encontrarás los parametros que recibe cada petición y permite realizar estas peticiones directamente desde esta página. Permitiendo realizar pruebas.