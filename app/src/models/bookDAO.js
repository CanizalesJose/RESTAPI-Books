const categoryDAO = require('./categoryDAO');
const authorDAO = require('./authorDAO');
const {newError, genId} = require('../utils');
const db = require('../connection/db');

class bookDAO {
    // Regresa un registro en base al id
    static async find(id){
        const mainSqlQuery = 'SELECT id, title, isbn, author, publisher, publishYear, category, copies, loanCopies, imageUrl FROM Books WHERE id = ?';
        try {
            if (!id){
                throw newError(400, "Falta el parametro id");
            }
            if (id.length == 0 || id.length > 15){
                throw newError(400, "El parametro id no cumple los requisitos de dato");
            }
            const result = await db.query(mainSqlQuery, [id]);
            if (!result){
                throw newError(500, "Error interno en consulta");
            }
            return result;
        } catch (error) {
            throw error;
        }
    }
    // Regresa los libros que tengan en alguna parte del titulo un string
    static async findTitle(title){
        const sqlQuery = 'SELECT Books.id as id, title, isbn, author, fullName, publisher, publishYear, category, copies, loanCopies, descr, imageUrl FROM Books INNER JOIN authors ON books.author=authors.id INNER JOIN categories ON books.category=categories.id WHERE title LIKE ?';
        try {
            if (!title)
                throw newError(400, 'Falta el parametro title');
            title = `%${title}%`
            const result = await db.query(sqlQuery, [title])
            .catch(error => {
                throw newError(500, 'Error en la consulta');
            });
            return result;
        } catch (error) {
            throw error;
        }
        
    }
    // Regresa todos los libros registrados
    static async findAll(){
        const mainSqlQuery = 'SELECT Books.id as id, title, isbn, author, fullName, publisher, publishYear, category, descr, imageUrl, copies, loanCopies FROM Books INNER JOIN authors ON books.author=authors.id INNER JOIN categories ON books.category=categories.id';
        try {
            const result = await db.query(mainSqlQuery);
            if (!result)
                throw newError(500, "Error interno en consulta");
            return result;
        } catch (error) {
            throw error;
        }
    }
    // Registrar un nuevo libro
    static async register(title, isbn, author, publisher, publishYear, category, copies, imageUrl){
        const sqlQuery1 = 'INSERT INTO Books (id, title, isbn, author, publisher, publishYear, category, copies, imageUrl) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
        const sqlQuery2 = 'INSERT INTO Books (id, title, isbn, author, publisher, publishYear, category, copies) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
        try {
            // Comprobar que existan los parametros
            if (!title)
                throw newError(400, "Falta el parametro title");
            if (!isbn)
                throw newError(400, "Falta el parametro isbn");
            if (!author)
                throw newError(400, "Falta el parametro author");
            if (!publisher)
                throw newError(400, "Falta el parametro publisher");
            if (!publishYear)
                throw newError(400, "Falta el parametro publishYear");
            if (!category)
                throw newError(400, "Falta el parametro category");
            if (!copies)
                throw newError(400, "Falta el parametro copies");
            var includeImage = false;
            if (imageUrl)
                includeImage = true;
            // Comprobar requisitos de datos
            if (title.length == 0 || title.length > 100)
                throw newError(400, "El parametro title no cumple los requisitos de longitud");
            if (isbn.length == 0 || isbn.length > 18)
                throw newError(400, "El parametro isbn no cumple los requisitos de longitud");
            if (author.length == 0 || author.length > 15)
                throw newError(400, "El parametro author no cumple los requisitos de dato");
            if (publisher.length == 0 || publisher.length > 100)
                throw newError(400, "El parametro publisher no cumple los requisitos de longitud");
            if (isNaN(parseInt(publishYear)))
                throw newError(400, "El parametro publishYear no es un número");
            if (category.length == 0 || category.length > 15)
                throw newError(400, "El parametro category no cumple los requisitos de longitud");
            if (isNaN(parseInt(copies)))
                throw newError(400, "El parametro copies no es un número");
            // Convertir en ints
            copies = parseInt(copies);
            publishYear = parseInt(publishYear);
            if (publishYear < 0)
                throw newError(400, "El parametro publishYear no puede ser menor a 0");
            if (copies < 0)
                throw newError(400, "El parametro copies no puede ser menor a 0");
            // Comprobaciones de relaciones
            var result = await authorDAO.find(author);
            if (!result)
                throw newError(500, "Error interno en la consulta");
            if (result.length == 0)
                throw newError(400, "El autor no existe");
            result = await categoryDAO.find(category);
            if (!result)
                throw newError(400, "La categoria no existe");
            let pass = false;
            let id = '';
            do {
                id = genId(15);                
                result = await this.find(id);
                if (!result)
                    throw newError(500, 'Error interno en la consulta')
                if (result.length == 0)
                    pass = true;
            } while (!pass);
            // Ejecutar consultas
            if (includeImage){
                if (imageUrl.length > 255)
                    throw newError(400, "El parametro imageUrl no puede tener mas de 255 caracteres");
                await db.query(sqlQuery1, [id, title, isbn, author, publisher, publishYear, category, copies, imageUrl]);
            }
            if (!includeImage)
                await db.query(sqlQuery2, [id, title, isbn, author, publisher, publishYear, category, copies])
            const newBook = await this.find(id);
            return newBook[0];
        } catch (error) {
            throw error;
        }
    }
    // Actualizar un registro
    static async update(id, title, isbn, author, publisher, publishYear, category, copies, loanCopies, imageUrl){
        const sqlQuery = 'UPDATE Books SET title = ?, isbn = ?, author = ?, publisher = ?, publishYear = ?, category = ?, copies = ?, loanCopies = ?, imageUrl = ? WHERE id = ?';
        try {
            // Comprobar que existan los parametros
            if (!id)
                throw newError(400, "Falta el parametro id");
            if (!title)
                throw newError(400, "Falta el parametro title");
            if (!isbn)
                throw newError(400, "Falta el parametro isbn");
            if (!author)
                throw newError(400, "Falta el parametro author");
            if (!publisher)
                throw newError(400, "Falta el parametro publisher");
            if (!publishYear)
                throw newError(400, "Falta el parametro publishYear");
            if (!category)
                throw newError(400, "Falta el parametro category");
            if (!copies)
                throw newError(400, "Falta el parametro copies");
            if (!copies)
                throw newError(400, "Falta el parametro loanCopies");
            if (!imageUrl)
                throw newError(400, "Falta el parametro imageUrl");
            // Comprobar requisitos de datos
            if (id.length == 0 || id.length > 15)
                throw newError(400, "El parametro id no cumple los requisitos de longitud");
            if (title.length == 0 || title.length > 100)
                throw newError(400, "El parametro title no cumple los requisitos de longitud");
            if (isbn.length == 0 || isbn.length > 18)
                throw newError(400, "El parametro isbn no cumple los requisitos de longitud");
            if (author.length == 0 || author.length > 15)
                throw newError(400, "El parametro author no cumple los requisitos de longitud");
            if (publisher.length == 0 || publisher.length > 100)
                throw newError(400, "El parametro publisher no cumple los requisitos de longitud");
            if (isNaN(parseInt(publishYear)))
                throw newError(400, "El parametro publishYear no es un número");
            publishYear = parseInt(publishYear);
            if (publishYear < 0)
                throw newError(400, "El parametro publishYear no puede ser menor a 0");
            if (category.length == 0 || category.length > 15)
                throw newError(400, "El parametro category no cumple los requisitos de longitud");
            if (isNaN(parseInt(copies)))
                throw newError(400, "El parametro copies debe ser un número");
            copies = parseInt(copies);
            if (copies < 1)
                throw newError(400, "Las copias no pueden ser menor a 1")
            if (isNaN(parseInt(loanCopies)))
                throw newError(400, "Las copias prestadas no son un número");
            loanCopies = parseInt(loanCopies)
            if (loanCopies < 0)
                throw newError(400, "Las copias prestadas no pueden ser menos que 0");
            if (imageUrl.length > 255)
                throw newError(400, "El parametro imageUrl no puede tener mas de 255 caracteres");
            // Comprobar si existen las llaves foraneas (author, category)
            var result = await authorDAO.find(author);
            if (!result)
                throw newError(500, "Error interno en la consulta");
            if (result.length == 0)
                throw newError(400, "El autor no existe");
            result = await categoryDAO.find(category);
            if (!result)
                throw newError(400, "La categoria no existe");
            result = await this.find(id);
            if (!result)
                throw newError(500, "Error en la consulta");
            if (result.length == 0)
                throw newError(400, "El registro no existe");
            if (result[0].loanCopies > result[0].copies)
                throw newError(400, "El número de copias prestadas no puede exceder el número de copias totales");
            await db.query(sqlQuery, [title, isbn, author, publisher, publishYear, category, copies, loanCopies, imageUrl, id]);
        } catch (error) {
            throw error;
        }
    }
    static async delete(id){
        const sqlQuery = 'DELETE FROM Books WHERE id = ?';
        try {
            if (!id)
                throw newError(400, "Falta el parametro id");
            const result = await this.find(id);
            if (!result)
                throw newError(500, "Error en la consulta");
            if (result.length == 0)
                throw newError(400, "El registro no existe");
            await db.query(sqlQuery, [id]);
        } catch (error) {
            throw error;
        }
    }
}

module.exports = bookDAO;