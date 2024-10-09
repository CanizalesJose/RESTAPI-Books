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
    static async checkCopies(bookId){
        const sqlQuery = 'SELECT copies, loanCopies from Books WHERE id = ?';
        return await db.query(sqlQuery, [bookId])
        .then(res => {
            return res[0];
        });
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
            // Revisar las copias de cada libro
            console.log(booksList);
            let missingBooks = [];
            for (const book of booksList) {
                let checkedBook = await this.checkCopies(book);
                if (checkedBook.loanCopies+1 > checkedBook.copies)
                    missingBooks.push(book);
            }
            if (missingBooks.length != 0)
                throw newError(400, `Estos libros estan agotados: ${missingBooks}`);
            // Para este punto, todo debería estar bien y se pueden hacer los inserts
            const sqlQuery1 = 'INSERT Loans(id, username, loanDate, returnDate) VALUES (?, ?, ?, ?)';
            const sqlQuery2 = 'INSERT LoanDetails(loanId, bookId) VALUES (?, ?)';
            // Genera un nuevo prestamo
            await db.query(sqlQuery1, [newId, username, loanDate, returnDate])
            .then(async () => {
                // Si se puede crear el registro, se intenta generar el detalle por cada libro
                for (const book of booksList){
                    await db.query(sqlQuery2, [newId, book])
                    .catch(async error => {
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
    static async findAll(){
        const sqlQuery = 'SELECT Loans.username as username, Loans.id AS id, Books.id AS bookId, Books.imageUrl as cover, Books.title as title, Authors.fullName as author, Categories.descr as category, Books.isbn as isbn, returned FROM Loans INNER JOIN loanDetails ON Loans.id = loanDetails.loanid INNER JOIN Books ON loanDetails.bookId = Books.id INNER JOIN Categories on Categories.id = Books.category INNER JOIN Authors on Books.author = Authors.id';
        return db.query(sqlQuery)
        .then(res => {
            // regresar resultados id, bookId, title
            return res;
        })
        .catch(error => {
            throw newError(500, `Error interno en la consulta: ${error.message}`);
        });
    }
    // Regresa el ID de los prestamos que estan completamente regresados
    static async findReturned(){
        const sqlQuery = 'select loans.id from loans join loandetails on loans.id = loandetails.loanid group by loans.id having count(*) = sum(loandetails.returned)';
        return db.query(sqlQuery)
        .then(res => {
            return res;
        });
    }
    static async findPending(){
        const sqlQuery ='select loans.id from loans join loandetails on loans.id = loandetails.loanid group by loans.id having sum(loandetails.returned = FALSE) > 0';
        return db.query(sqlQuery)
        .then(res => {
            return res;
        });
    }
    static async findIDs(){
        const sqlQuery = 'SELECT id from Loans';
        return db.query(sqlQuery)
        .then(res => {
            return res;
        })
        .catch(error => {
            throw newError(500, `Error interno en la consulta: ${error.message}`);
        })
    }
    static async findFromUser(username){
        const sqlQuery = 'SELECT Loans.username as username, Loans.id AS id, Books.id AS bookId, Books.imageUrl as cover, Books.title as title, Authors.fullName as author, Categories.descr as category, Books.isbn as isbn, returned FROM Loans INNER JOIN loanDetails ON Loans.id = loanDetails.loanid INNER JOIN Books ON loanDetails.bookId = Books.id INNER JOIN Categories on Categories.id = Books.category INNER JOIN Authors on Books.author = Authors.id WHERE username = ?';
        if (!username)
            throw newError(400, "Falta el parámetro username");
        return db.query(sqlQuery, [username])
        .then(res => {
            return res;
        })
        .catch(error => {
            throw newError(500, `Error interno en la consulta: ${error.message}`);
        });
    }
    static async updateReturn(newStatus, loanId, bookId){
        const sqlQuery = 'UPDATE loanDetails SET returned = ? WHERE loanId = ? AND bookId = ?';
        if (!newStatus)
            throw newError(400, 'Falta el parámetro newStatus');
        if (isNaN(parseInt(newStatus)))
            throw newError(400, 'El nuevo estado debe ser 0 o 1');
        newStatus = parseInt(newStatus);
        if (newStatus > 1 || newStatus < 0)
            throw newError(400, "El nuevo estado debe ser verdadero (0) o falso (1)");
        if (!loanId)
            throw newError(400, "Falta el parametro loanId");
        if (!bookId)
            throw newError(400, "Falta el parametro bookId");
        db.query(sqlQuery, [newStatus, loanId, bookId])
        .catch(error => {
            throw newError(500, `Error interno en la consulta: ${error.message}`);
        });
    }
}

module.exports = loansDAO;