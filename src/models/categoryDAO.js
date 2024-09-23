const db = require('../connection/db');

class categoryDAO{
    // Busca una categoria en base a una id, regresa [] si falla, [{id:?, descr:?}] si no
    static async find(id){
        const mainSqlQuery = 'SELECT id, descr FROM Categories WHERE id = ?';
        if (!id || id.length == 0 || id.length > 15)
            return 1;
        try {
            const categoria = await db.query(mainSqlQuery, [id]);
            return categoria;
        } catch (error) {
            return 1;
        }
    }
    // Regresa todas las categorias en formato json
    static async findAll(){
        const mainSqlQuery = 'SELECT id, descr FROM Categories';
        try {
            const categories = await db.query(mainSqlQuery);
            if (!categories)
                throw new Error();
            return categories;
                
        } catch (error) {
            return [];
        }
    }
    // Crea una categoria, regresa 1 si falla, 0 si no
    static async register(id, descr){
        const mainSqlQuery = 'INSERT Categories(id, desc) VALUES (?, ?)';
        if (id.length > 15 || id.length == 0 || descr.length > 100 || descr.length == 0)
            return 1;
        try {
            const exists = await this.find(id);
            if (!exists)
                throw new Error();
            if (exists && exists.length != 0)
                throw new Error();
            await db.query(mainSqlQuery, [id, descr]);
            return 0;
        } catch (error) {
            return 1;
        }
    }
    // Actualiza una categoria, regresa 1 si falla, 0 si no
    static async update(updatedId, newDescr){
        const mainSqlQuery = 'UPDATE Categories SET descr = ? WHERE id = ?';
        if (updatedId == 0)
            return 1;
        if (newDescr == 0 || newDescr > 100)
            return 1;
        try {
            const exists = await this.find(updatedId);
            if (!exists)
                throw new Error();
            if (exists && exists.length == 0)
                throw new Error();
            await db.query(mainSqlQuery, [newDescr, updatedId]);
            return 0;
        } catch (error) {
            return 1;
        }
    }
    // Borra una categoria
    static async delete(id){
        const mainSqlQuery = 'DELETE FROM Categories WHERE id = ?';
        if (id && id.length == 0)
            return 1;
        try {
            const exists = await this.find(id);
            if (!exists)
                throw new Error();
            if (exists && exists.length == 0)
                throw new Error();
            await db.query(mainSqlQuery, [id]);
            return 0;
        } catch (error) {
            return 1;
        }
    }
}
module.exports = categoryDAO;