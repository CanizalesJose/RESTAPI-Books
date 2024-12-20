const db = require('../connection/db');
const {newError, genId} = require('../utils');

class categoryDAO{
    // Busca una categoria en base a una id, regresa [] si falla, [{id:?, descr:?}] si no
    static async find(id){
        const mainSqlQuery = 'SELECT id, descr FROM Categories WHERE id = ?';
        try {
            if (!id)
                throw newError(400, "Falta el parametro id");
            if (id.length == 0 || id.length > 15)
                throw newError(400, "El id no cumple los requisitos de dato");
            const categoria = await db.query(mainSqlQuery, [id]);
            if (!categoria)
                throw newError(500, "Error en la consulta");
            return categoria;
        } catch (error) {
            throw error;
        }
    }
    // Regresa todas las categorias en formato json
    static async findAll(){
        const mainSqlQuery = 'SELECT id, descr FROM Categories';
        try {
            const categories = await db.query(mainSqlQuery);
            if (!categories)
                throw newError(500, "Error en la consulta");
            return categories;
                
        } catch (error) {
            throw error;
        }
    }
    // Busca por descripción
    static async findByDescr(descr){
        const sqlQuery = 'SELECT id, descr FROM Categories WHERE descr LIKE ?';
        try {
            if (!descr)
                throw newError(400, 'Falta el parametro descr');
            descr = `%${descr}%`
            return await db.query(sqlQuery, [descr])
            .then(res => {
                return res;
            })
            .catch(error => {
                throw newError(500, `Error interno en la consulta: ${error.message}`);
            });
        } catch (error) {
            throw error;
        }
    }
    // Crea una categoria, regresa error si falla, regresa 0 si no
    static async register(descr){
        const mainSqlQuery = 'INSERT Categories(id, descr) VALUES (?, ?)';
        try{
            if (!descr)
                throw newError(400, "Falta el parametro descr");
            if (descr.length > 100 || descr.length == 0)
                throw newError(400, 'El parametro descr no cumple los requisitos de dato');
            // Generar un id único
            let pass = false;
            let id = genId(15);
            let result = null;
            do {
                result = await this.find(id);
                if (!result)
                    throw newError(500, 'Error interno en el servidor');
                if (result.length == 0)
                    pass = true;
                else
                    id = genId(15);
            } while (!pass);
            await db.query(mainSqlQuery, [id, descr]);
            return {id: id, descr: descr};
        }catch(error){
            throw error;
        }
    }
    // Actualiza una categoria, regresa 1 si falla, 0 si no
    static async update(id, descr){
        const mainSqlQuery = 'UPDATE Categories SET descr = ? WHERE id = ?';
        try{
            if (!id)
                throw newError(400, "Falta el parametro id");
            if (!descr)
                throw newError(400, "Falta el parametro descr");
                
            if (id == 0 || id > 15)
                throw newError(400, "El parametro id no cumple los requisitos de dato");
            if (descr == 0 || descr > 100)
                throw newError(400, "El parametro descr no cumple los requisitos de dato");
            const exists = await this.find(id);
            if (!exists)
                throw newError(500, "Error en la consulta");
            if (exists.length == 0)
                throw newError(400, "El registro no existe");
            await db.query(mainSqlQuery, [descr, id]);
        } catch (error){
            throw error;
        }
    }
    // Borra una categoria
    static async delete(id){
        const mainSqlQuery = 'DELETE FROM Categories WHERE id = ?';
        try {
            if (!id)
                throw newError(400, "Falta el parametro id");
            if (id.length == 0 || id.length > 15)
                throw newError(400, "El parametro id no cumple los requisitos de datos");
            const exists = await this.find(id);
            if (!exists)
                throw newError(500, "Error en la consulta");
            if (exists.length == 0)
                throw newError(400, "El registro no existe");
            await db.query(mainSqlQuery, [id]);
        } catch (error) {
            throw error;
        }
    }
}
module.exports = categoryDAO;