const db = require('../connection/db');
const {newError} = require('../utils');

class authorModel{
    // Recibe un id, comprueba y regresa un autor, genera un error en caso de falla
    static async find(id){
        const mainSqlQuery = 'SELECT id, fullName, nationality from Authors WHERE id = ?';
        try {
            if (!id)
                throw newError(400, "Faltan parametros");
            if (id.length == 0 || id.length > 15)
                throw newError(200, "El id no es valido");
            const results = await db.query(mainSqlQuery, [id]);
            if (!results)
                throw newError(500, "Error en la consulta");
            return results;
        } catch (error) {
            throw error;
        }
    }
    // Regresa todos los autores, en caso de falla genera un error
    static async findAll(){
        const mainSqlQuery = 'SELECT id, fullName, nationality from Authors';
        try {
            const results = await db.query(mainSqlQuery);
            if (!results)
                throw newError(500, "Error en la consulta");
            return results;
        } catch (error) {
            throw error;
        }
    }
    // Registra un usuario, lanza error si falla
    static async register(newId=null, newFullname=null, newNationality=null){
        const mainSqlQuery = 'INSERT Authors(id, fullname, nationality) VALUES (?, ?, ?)';
        try {
            if (!newId || !newFullname || !newNationality)
                throw newError(400, "Faltan parametros");
            if (newId.length == 0 || newId.length > 15)
                throw newError(400, "El Id no cumple los requisitos de dato");
            if (newFullname.length == 0 || newFullname.length > 100)
                throw newError(400, "El nombre no cumple los requisitos de dato");
            if (newNationality.length == 0 || newNationality > 50)
                throw newError(400, "La nacionalidad no cumple los requisitos de dato");
            const result = await this.find(newId);
            if (!result)
                throw newError(500, "Error en la consulta");
            if (result.length > 0)
                throw newError(400, "El registro ya existe");
            await db.query(mainSqlQuery, [newId, newFullname, newNationality]);
            return 0;
        } catch (error) {
            throw error;
        }
    }
    // Actualiza un dato de un autor en base a los datos enviados, lanza error si falla
    static async update(id=undefined, newFullname=undefined, newNationality=undefined){
        const nameSqlQuery = 'UPDATE Authors SET fullname = ? WHERE id =?';
        const nationalitySqlQuery = 'UPDATE Authors SET nationality = ? WHERE id = ?';
        try {
            var changeName = false; 
            var changeNation = false;
            // Comprobar id
            if (!id)
                throw newError(400, "Falta el parametro id");
            if (id.length == 0 || id.length > 15)
                throw newError(400, "El id no cumple con los requisitos de dato");
            // Comprobar nombre
            if (newFullname){
                if (newFullname.length == 0 || newFullname.length > 100)
                    throw newError(400, "El nombre no cumple con los requisitos de dato");
                changeName = true;
            }
            // Comprobar nacionalidad
            if (newNationality){
                if (newNationality.length == 0 || newNationality.length > 50)
                    throw newError(400, "La nacionalidad no cumple con los requisitos de dato");
                changeNation = true;
            }
            // Comprobra que al menos un parametro se haya enviado
            if (changeName == false && changeNation == false)
                throw newError(400, "Al menos el nombre o la nacionalidad se debe mandar como parametro");
            // Revisar si existe el registro a actualizar
            const result = this.find(id);
            if (!result)
                throw newError(500, "Error en la consulta");
            if (result.length == 0)
                throw newError(400, "El registro no existe");
            // Si no fallos en parametros y el registro existe, entonces actualiza
            if (changeName == true)
                await db.query(nameSqlQuery, [newFullname, id]);
            if (changeNation == true)
                await db.query(nationalitySqlQuery, [newNationality, id]);
            return 0;
        } catch (error) {
            throw error;
        }
    }
    static async delete(id=undefined){
        const mainSqlQuery = 'DELETE FROM Authors WHERE id = ?';
        try {
            if (!id)
                throw newError(400, "Falta el parametro id");
            const result = this.find(id);
            if (!result)
                throw newError(500, "Error en la consulta");
            if (result.length == 0)
                throw newError(400, "El registro no existe");
            await db.query(mainSqlQuery, [id]);
        } catch (error) {
            throw error;
        }
    }
}

module.exports = authorModel;