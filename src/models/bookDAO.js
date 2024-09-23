const categoryDAO = require('./categoryDAO');
const db = require('../connection/db');

class bookDAO {
    static async find(id){
        const mainSqlQuery = 'SELECT id, title, isbn, author, publisher, publishYear, category, copies, imageUrl FROM Books WHERE id = ?';
        try {
            const book = db.query(mainSqlQuery, [id]);
            if (book)
                return book;
            else
                return []
        } catch (error) {
            return [];
        }
    }
    // Regresa todos los libros registrados
    static async findAll(){
        const mainSqlQuery = 'SELECT id, title, isbn, author, publisher, publishYear, category, copies, imageUrl FROM Books';
        try {
            const allBooks = await db.query(mainSqlQuery);
            return allBooks;
        } catch (error) {
            return [];
        }
    }
    // Registrar un nuevo libro
    static async register(id, title, isbn, author, publisher, publishYear, category, copies, imageUrl){
        const mainSqlQuery = 'INSERT INTO Books (id, title, isbn, author, publisher, publishYear, category, copies, imageUrl) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
        try {
            // Si existe el libro, entonces no puede registrar nuevo
            const exists = await this.find(id);
            if (exists || exists.length > 0)
                return 1;
            // Si no existe el autor
            // Si no existe la categoria
            else{
                await db.query(mainSqlQuery, [id, title, isbn, author, publisher, publishYear, category, copies, imageUrl]);
            }
        } catch (error) {
            return 1;
        }
    }
}

module.exports = bookDAO;