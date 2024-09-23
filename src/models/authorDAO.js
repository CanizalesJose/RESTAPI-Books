const db = require('../connection/db');

class authorModel{
    static async find(id){
        const mainSqlQuery = 'SELECT id, fullName, nationality from Authors WHERE id = ?';
        try {
            if (!id)
                throw new Error("Faltan parametros");
            if (id.length == 0 || id.length > 15)
                throw new Error("El id no es valido");
            const autor = await db.query(mainSqlQuery, [id]);
            if (!autor)
                throw new Error("Error en la consulta");
            return autor;
        } catch (error) {
            throw error;
        }
    }
    static async findAll(){
        const mainSqlQuery = 'SELECT id, fullName, nationality from Authors';
        try {
            const results = await db.query(mainSqlQuery);
            if (!results)
                throw new Error("Error en la consulta");
            return results;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = authorModel;