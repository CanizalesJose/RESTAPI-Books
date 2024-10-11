const {newError, genId} = require('../utils');
const db = require('../connection/db');

class catalogDAO{
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
    static async makeVisible(id, bookId){
        try {
            const sqlQuery = 'UPDATE Catalog SET isVisible = 1 WHERE id = ? AND bookId = ?';
            if (!id)
                throw newError(400, 'Falta el parametro id');
            if (!bookId)
                throw newError(400, 'Falta el parametro bookId');
            let result = db.query('SELECT id FROM Catalog WHERE id = ? AND bookId = ?', [id, bookId])
            .then(res => {
                if (res.length != 1)
                    throw newError(400, 'El registro no existe');
            })
            .catch(error => {
                throw newError(500, `Error interno en consulta: ${error.message}`);
            });
            
        } catch (error) {
         throw error;   
        }
    }
}

module.exports = catalogDAO;