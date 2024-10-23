const {newError, genId} = require('../utils');
const db = require('../connection/db');

class catalogDAO{
    static async find(bookId){
        try {
            const sqlQuery = 'SELECT bookId FROM Catalog WHERE bookId = ?';
            return db.query(sqlQuery, [bookId])
            .then(res => {
                if (!res)
                    throw newError(500, 'Error interno en la consulta');
                return res;
            });
        } catch (error) {
            throw error;
        }
    }
    static async addBook(bookId, summary, isVisible){
        try {
            const sqlQuery = 'INSERT INTO Catalog (id, bookId, summary, isVisible) VALUES (?, ?, ?, ?)';
            if (!bookId)
                throw newError(400, 'Falta el parametro bookId');
            if (!summary)
                throw newError(400, 'Falta el parametro summary');
            if (!isVisible)
                throw newError(400, 'Falta el paraemtro isVisible');
    
            await db.query('SELECT id from Books WHERE id = ?', [bookId])
            .then(res => {
                if (res.length == 0)
                    throw newError(400, 'El libro no existe');
            })
            .catch(error => {
                throw newError(`Error en la consulta: ${error.message}`);
            });
            
            if (isNaN(parseInt(isVisible)))
                throw newError(400, 'El parametro isVisible debe ser 0 o 1');
            isVisible = parseInt(isVisible);
            if (isVisible !=0 && isVisible != 1 )
                throw newError(400, 'El parametro isVisible debe ser 0 o 1');
            // Generar nuevo id
            let pass = false;
            let newId = genId(15);
            do {
                await db.query('SELECT id, bookId FROM Catalog WHERE id = ?', [newId])
                .then(res => {
                    if (res.length == 0)
                        pass = true;
                    else
                        newId = genId(15);
                })
                .catch(error => {
                    throw newError(500, `Error interno en la consulta: ${error.message}`);
                });
            } while (pass == false);
            await db.query('SELECT id, bookId FROM Catalog WHERE bookId = ?', [bookId])
            .then(res => {
                if (res.length !=  0)
                    throw newError(400, 'El libro ya esta registrado');
            })
            .catch(error => {
                throw newError(500, `Error interno en la consulta: ${error.message}`);
            });
            // Generar nuevo registro
            await db.query(sqlQuery, [newId, bookId, summary, isVisible]);
        } catch (error) {
            throw error;
        }
    }
    static async remove(id, bookId){
        try {
            const sqlQuery = 'DELETE FROM Catalog WHERE id = ? AND bookId = ?';
            return db.query(sqlQuery, [id, bookId])
            .then(res => {
                if (res.affectedRows == 0)
                    return 'No hubo cambios'
                else
                    return 'Registro eliminado';
            })
            .catch(error => {
                throw newError();
            });
        } catch (error) {
            throw error;
        }
    }
    static async editSummary(id, bookId, summary){
        try {
            if (!id)
                return newError(400, 'Falta el parámetro id');
            if (!bookId)
                return newError(400, 'Falta el parametro bookId');
            if (!summary)
                return newError(400, 'Falta el parametro summary');
            const sqlQuery = 'UPDATE Catalog SET summary = ? WHERE id = ? AND bookId = ?';
            await db.query(sqlQuery, [summary, id, bookId])
            .catch(error => {
                throw error;
            });
        } catch (error) {
            throw error;
        }
    }
    static async makeVisible(id, bookId){
        try {
            const sqlQuery = 'UPDATE Catalog SET isVisible = 1 WHERE id = ? AND bookId = ?';
            if (!id)
                throw newError(400, 'Falta el parametro id');
            if (!bookId)
                throw newError(400, 'Falta el parametro bookId');
            await db.query('SELECT id FROM Catalog WHERE id = ? AND bookId = ?', [id, bookId])
            .then(async res => {
                if (res.length != 1)
                    throw newError(400, 'El registro no existe');
                await db.query(sqlQuery, [id, bookId]);
            })
            .catch(error => {
                throw newError(500, `Error interno en consulta: ${error.message}`);
            });
            
        } catch (error) {
         throw error;   
        }
    }
    static async makeNotVisible(id, bookId) {
        try {
            const sqlQuery = 'UPDATE Catalog SET isVisible = 0 WHERE id = ? AND bookId = ?';
            if (!id)
                throw newError(400, 'Falta el parametro id');
            if (!bookId)
                throw newError(400, 'Falta el parametro bookId');
            await db.query('SELECT id FROM Catalog WHERE id = ? AND bookId = ?', [id, bookId])
            .then(async res => {
                if (res.length != 1)
                    throw newError(400, 'El registro no existe');
                await db.query(sqlQuery, [id, bookId]);
            })
            .catch(error => {
                throw newError(500, `Error interno en consulta: ${error.message}`);
            });
            
        } catch (error) {
         throw error;   
        }
    }
    static async fetchNotInCatalog(){
        try {
            const sqlQuery = 'SELECT imageUrl, Books.id as bookId, title,  fullName, descr, copies, loanCopies FROM Books INNER JOIN Authors ON Books.author = Authors.id INNER JOIN Categories ON Books.category = Categories.id  WHERE Books.id NOT IN (SELECT bookId FROM Catalog)';
            return db.query(sqlQuery)
            .then(res => {
                return res;
            })
            .catch(error => {
                throw newError(500, `Error en la consulta: ${error.message}`);
            });
        } catch (error) {
            throw error
        }
    }
    static async fetchInCatalog(){
        try {
            const sqlQuery = 'SELECT imageUrl, Books.id as bookId, title, fullName, descr, copies, loanCopies, isVisible, Catalog.id as catalogId, summary FROM Books INNER JOIN Authors ON Books.author = Authors.id INNER JOIN Categories ON Books.category = Categories.id  INNER JOIN Catalog on Books.id = Catalog.bookId WHERE Books.id IN (SELECT bookId FROM Catalog) ORDER BY isVisible, title';
            return db.query(sqlQuery)
            .then(res => {
                return res;
            })
            .catch(error => {
                throw newError(500, `Error en la consulta: ${error.message}`);
            });
        } catch (error) {
            throw error;
        }
    }
}

module.exports = catalogDAO;