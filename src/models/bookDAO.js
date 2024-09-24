const categoryDAO = require('./categoryDAO');
const authorDAO = require('./authorDAO');
const {newError} = require('../utils');
const db = require('../connection/db');

class bookDAO {
    // Regresa un registro en base al id
    static async find(id){
        const mainSqlQuery = 'SELECT id, title, isbn, author, publisher, publishYear, category, copies, imageUrl FROM Books WHERE id = ?';
        try {
            if (!id){
                throw newError(400, "Falta el parametro id");
            }
            if (id.length == 0 || id.length > 15){
                throw newError(400, "El parametro id no cumple los requisitos de dato");
            }
            const result = db.query(mainSqlQuery, [id]);
            if (!result){
                throw newError(500, "Error interno en consulta");
            }
            return result;
        } catch (error) {
            throw error;
        }
    }
    // Regresa todos los libros registrados
    static async findAll(){
        const mainSqlQuery = 'SELECT id, title, isbn, author, publisher, publishYear, category, copies, imageUrl FROM Books';
        try {
            const result = db.query(mainSqlQuery);
            if (!result)
                throw newError(500, "Error interno en consulta");
            return result;
        } catch (error) {
            throw error;
        }
    }
    // Registrar un nuevo libro
    static async register(id, title, isbn, author, publisher, publishYear, category, copies, imageUrl){
        const sqlQuery1 = 'INSERT INTO Books (id, title, isbn, author, publisher, publishYear, category, copies, imageUrl) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
        const sqlQuery2 = 'INSERT INTO Books (id, title, isbn, author, publisher, publishYear, category, copies) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
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
            const includeImage = false;
            if (imageUrl)
                includeImage = true;
            // Comprobar requisitos de datos
            if (id.length == 0 || id.length > 15)
                throw newError(400, "El parametro id no cumple los requisitos de dato");
            if (title.length == 0 || title.length > 100)
                throw newError(400, "El parametro title no cumple los requisitos de dato");
            if (isbn.length == 0 || isbn.length > 18)
                throw newError(400, "El parametro isbn no cumple los requisitos de dato");
            if (author.length == 0 || author.length > 15)
                throw newError(400, "El parametro author no cumple los requisitos de dato");
            if (publisher.length == 0 || publisher.length > 100)
                throw newError(400, "El parametro publisher no cumple los requisitos de dato");
            if (isNaN(parseInt(publishYear)))
                throw newError(400, "El parametro publishYear no es un número");
            if (category.length == 0 || category.length > 15)
                throw newError(400, "El parametro category no cumple los requisitos de dato");
            if (isNaN(parseInt(copies)))
                throw newError(400, "El parametro copies no es un número");
            // Convertir en ints
            publishYear = parseInt(publishYear);
            copies = parseInt(copies);
            if (copies < 0)
                throw newError(400, "El parametro copies no puede ser menor a 0");
            if (publishYear < 0)
                throw newError(400, "El parametro publishYear no puede ser menor a 0");
            // Comprobaciones de relaciones
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
            if (result.length > 0)
                throw newError(400, "El registro ya existe");
            // Ejecutar consultas
            if (includeImage){
                if (imageUrl.length > 255)
                    throw newError(400, "El parametro imageUrl no puede tener mas de 255 caracteres");
                await db.query(sqlQuery1, [id, title, isbn, author, publisher, publishYear, category, copies, imageUrl]);
            }
            if (!includeImage)
                await db.query(sqlQuery2, [id, title, isbn, author, publisher, publishYear, category, copies])
        } catch (error) {
            throw error;
        }
    }
    // Actualizar un registro
    static async update(id, title, isbn, author, publisher, publishYear, category, copies, imageUrl){
        const sqlQuery = 'UPDATE Books SET title = ?, isbn = ?, author = ?, publisher = ?, publishYear = ?, category = ?, copies = ?, imageUrl = ? WHERE id = ?';
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
            if (!imageUrl)
                throw newError(400, "Falta el parametro imageUrl");
            // Comprobar requisitos de datos
            if (id.length == 0 || id.length > 15)
                throw newError(400, "El parametro id no cumple los requisitos de dato");
            if (title.length == 0 || title.length > 100)
                throw newError(400, "El parametro title no cumple los requisitos de dato");
            if (isbn.length == 0 || isbn.length > 18)
                throw newError(400, "El parametro isbn no cumple los requisitos de dato");
            if (author.length == 0 || author.length > 15)
                throw newError(400, "El parametro author no cumple los requisitos de dato");
            if (publisher.length == 0 || publisher.length > 100)
                throw newError(400, "El parametro publisher no cumple los requisitos de dato");
            if (isNaN(parseInt(publishYear)))
                throw newError(400, "El parametro publishYear no es un número");
            publishYear = parseInt(publishYear);
            if (publishYear < 0)
                throw newError(400, "El parametro publishYear no puede ser menor a 0");
            if (category.length == 0 || category.length > 15)
                throw newError(400, "El parametro category no cumple los requisitos de dato");
            if (isNaN(parseInt(copies)))
                throw newError(400, "El parametro copies no es un número");
            copies = parseInt(copies);
            if (copies < 0)
                throw newError(400, "El parametro copies no puede ser menor a 0");
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
            await db.query(sqlQuery, [title, isbn, author, publisher, publishYear, category, copies, imageUrl, id]);
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