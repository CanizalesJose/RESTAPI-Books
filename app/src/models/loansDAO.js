const db = require('../connection/db');
const bookDAO = require('./bookDAO');
const userDAO = require('./userDAO');
const {newError, genId, isJSON} = require('../utils')

class loansDAO{
    static async find(id){
        const sqlQuery = 'SELECT id, loanDate FROM loans WHERE id = ?';
        try {
            if (!id)
                throw newError(400, "Falta el parametro id");
            if (id.length == 0 || id.length > 15)
                throw newError(400, "El parametro id no cumple los requisitos de dato");
            const result = db.query(sqlQuery, [id]);
            if (!result)
                throw newError(500, "Error interno en la consulta");
            return result;
        } catch (error) {
            throw error;
        }
    }
    // El cliente manda la fecha en que pidió los libros y la lista con los id de los libros pedidos
    // Los libros se regresan una semana despues como máximo
    // El id del prestamo se genera dinamicamente
    static async newLoan(booksList, username){
        try{
            // Generar fecha actual
            var loanDate = new Date();
            // Agregar 7 días a la fecha actual
            var returnDate = new Date(loanDate.getTime()+7*24*60*60*1000);
            loanDate = loanDate.toISOString().split('T')[0];
            returnDate = returnDate.toISOString().split('T')[0];
            
            if (!booksList)
                throw newError(400, "Falta el parametro booksList");
            if (!isJSON(booksList))
                throw newError(400, "booksList debe ser una cadena JSON");
            booksList = JSON.parse(booksList);
            if (!Array.isArray(booksList))
                throw newError(400, "El parametro booksList no es una lista");
            if (booksList.length == 0)
                throw newError(400, "La lista de libros no puede estar vacía");
            booksList = new Set(booksList);

            if (!username)
                throw newError(400, "Falta el parametro username");
            
            let pass = false;
            let newId = genId(15);
            let result = null;
            // Genera un id aleatorio que no este en base de datos
            do {
                result = await this.find(newId);
                if (!result)
                    throw newError(500, "Error interno en la consulta");
                if (result.length == 0)
                    pass = true
                else
                    newId = genId(15);
            } while (!pass);
            // Comprueba que todos los libros esten en base de datos
            result = null;
            for (let i = 0; i < booksList.length; i++) {
                const bookId = booksList[i];
                result = await bookDAO.find(bookId);
                if (!result)
                    throw newError(500, "Error interno en la consulta");
                if (result.length == 0)
                    throw newError(400, `El libro ${bookId} no existe`);
            }
            // Comprueba que el usuario exista
            result = null;
            result = await userDAO.findUser(username);
            if (!result)
                throw newError(500, "Error interno en la consulta");
            if (result.length == 0)
                throw newError(400, "El usuario no existe");

            const sqlQuery1 = 'INSERT Loans(id, username, loanDate, returnDate) VALUES (?, ?, ?, ?)';
            const sqlQuery2 = 'INSERT LoanDetails(loanId, bookId) VALUES (?, ?)';
            // Genera un nuevo prestamo
            await db.query(sqlQuery1, [newId, username, loanDate, returnDate])
            .then(async () => {
                // Si se puede crear el registro, se intenta generar el detalle por cada libro
                for (const book of booksList){
                    await db.query(sqlQuery2, [newId, book])
                    .catch(error => {
                        // Si no se puede, se gestiona un error para que lo atrape la query original
                        if (error.sqlState && error.sqlState=='45000')
                            throw newError(400, error.message + ` ${book}`);
                        throw newError(500, "Error interno en la consulta");
                    });
                }
            })
            .catch(error => {
                // Si falla cualquier cosa, regresa el código de error y el mensaje
                throw newError(400, error.message);
            });
        } catch (error) {
            throw error;
        }
    }
    static async findAll(id){
        const sqlQuery = 'SELECT loans.id AS id, books.id AS bookId, books.title AS title FROM loans INNER JOIN loandetails ON loans.id = loandetails.loanid INNER JOIN books ON loandetails.bookId = books.id WHERE loans.id = ?';
        if (!id)
            throw newError(400, "Falta el parametro id");
        await db.query(sqlQuery, [id])
        .then(res => {
            // regresar resultados
            return res;
        });
    }
}

module.exports = loansDAO;