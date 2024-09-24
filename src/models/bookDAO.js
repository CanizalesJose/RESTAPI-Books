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
            // Comprobar parametros
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
        } catch (error) {
            throw error;
        }

    }
}

module.exports = bookDAO;