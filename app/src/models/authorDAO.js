const db = require('../connection/db');
const {newError, genId} = require('../utils');

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
    static async findByName(name){
        const sqlQuery = 'SELECT id, fullName, nationality FROM Authors WHERE fullName LIKE ?';
        try {
            if (!name)
                throw newError(400, 'Falta el parametro name');
            name = `%${name}%`
            return await db.query(sqlQuery, [name])
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
    // Registra un usuario, lanza error si falla
    static async register(newFullname=null, newNationality=null){
        const mainSqlQuery = 'INSERT Authors(id, fullname, nationality) VALUES (?, ?, ?)';
        try {
            if (!newFullname)
                throw newError(400, "Falta el parametro newFullname");
            if (!newNationality)
                throw newError(400, "Falta el parametro newNationality");
            if (newFullname.length == 0 || newFullname.length > 100)
                throw newError(400, "El nombre no cumple los requisitos de dato");
            if (newNationality.length == 0 || newNationality > 50)
                throw newError(400, "La nacionalidad no cumple los requisitos de dato");

            let newId = genId(15);
            let pass = false;
            let result = null;
            do {
                result = await this.find(newId);
                if (!result)
                    throw newError(500, 'Error interno en consulta');
                if (result.length == 0)
                    pass = true;
                else
                    newId = genId(15);
            } while (pass == false);
            await db.query(mainSqlQuery, [newId, newFullname, newNationality]);
            return {
                id: newId,
                fullName: newFullname,
                nationality: newNationality
            };
        } catch (error) {
            throw error;
        }
    }
    // Actualiza un dato de un autor en base a los datos enviados, lanza error si falla
    static async update(id=undefined, newFullname=undefined, newNationality=undefined){
        const sqlQuery = 'UPDATE Authors SET fullname = ?, nationality = ? WHERE id =?';
        try {
            // Comprobar id
            if (!id)
                throw newError(400, "Falta el parametro id");
            if (id.length == 0 || id.length > 15)
                throw newError(400, "El id no cumple con los requisitos de dato");
            if (!newFullname && !newNationality)
                throw newError(400, "Faltan los parametros newFullname y newNationality");
            // Comprobar nombre
            if (!newFullname)
                throw newError(400, "Falta el parametro newFullname");
            if (newFullname.length == 0 || newFullname.length > 100)
                throw newError(400, "El nombre no cumple con los requisitos de dato");
            // Comprobar nacionalidad
            if (!newNationality)
                throw newError(400, "Falta el parametro newNationality");
            if (newNationality.length == 0 || newNationality.length > 50)
                throw newError(400, "La nacionalidad no cumple con los requisitos de dato");
            // Revisar si existe el registro a actualizar
            const result = this.find(id);
            if (!result)
                throw newError(500, "Error en la consulta");
            if (result.length == 0)
                throw newError(400, "El registro no existe");
            await db.query(sqlQuery, [newFullname, newNationality, id]);
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