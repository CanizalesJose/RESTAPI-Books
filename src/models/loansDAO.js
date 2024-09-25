const db = require('../connection/db');
const bookDAO = require('./bookDAO');
const userDAO = require('./userDAO');
const {newError, genId} = require('../utils')

class loansDAO{
    static async find(id){
        const sqlQuery = 'SELECT id FROM loans WHERE id = ?';
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
    static async newLoan(loanDate, booksList, username){
        try {
            // Validar datos
            if (!loanDate)
                throw newError(400, "Falta el parametro loanDate");
            if (isNaN(Date.parse(loanDate)))
                throw newError(400, "El parametro loanDate no cumple el formato YYYY-MM-DD");
            loanDate = new Date(loanDate);
            var returnDate = new Date(loanDate.getTime()+7*24*60*60*1000);
            loanDate = loanDate.toISOString().split('T')[0];
            returnDate = returnDate.toISOString().split('T')[0];
            console.log(loanDate);
            console.log(returnDate);
            if (!booksList)
                throw newError(400, "Falta el parametro booksList");
            if (!Array.isArray(booksList))
                throw newError(400, "El parametro booksList no es una lista");
            if (!username)
                throw newError(400, "Falta el parametro username");

            let valid = false;
            let newId = genId(15);
            let result = null;
            // Genera un id aleatorio que no este en base de datos
            do {
                result = await this.find(newId);
                if (!result)
                    throw newError(500, "Error interno en la consulta");
                if (result.length == 0)
                    valid = true
                else
                    newId = genId(15);
            } while (!valid);
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
            result = null
            result = await userDAO.findUser(username);
            if (!result)
                throw newError(500, "Error interno en la consulta");
            if (result.length == 0)
                throw newError(400, "El usuario no existe");

            const sqlQuery1 = 'INSERT Loans(id, username, loanDate, returnDate) VALUES (?, ?, ?, ?)';
            const sqlQuery2 = 'INSERT LoanDetails(loanId, bookId) VALUES (?, ?)';
        } catch (error) {
            throw error;
        }
    }
}

module.exports = loansDAO;