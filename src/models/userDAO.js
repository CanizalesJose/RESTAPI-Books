const db = require('../connection/db');
const {encryptText} = require('../utils');

class userDAO {
    static async findAllUsers(){
        const sqlQuery = 'SELECT username, usertype FROM Users';
        try {
            const results = await db.query(sqlQuery);
            if (!results)
                throw new Error('Error en la consulta');
            return results;
        } catch (error) {
            throw error;
        }
    }
    // Regresa un arreglo de diccionarios si encuentra un usuario en base a un nombre
    static async findUser(username){
        const sqlQuery = 'SELECT username, userpassword, usertype FROM Users WHERE username = ?;'
        try {
            if (!username)
                throw new Error("Falta parametro username");
            if (username.length == 0 || username.length > 30)
                throw new Error("El username no cumple los requisitos de dato");
            const result = await db.query(sqlQuery, [username]);
            if (!result)
                throw new Error("Error en la consulta");
            return result;
        } catch (error) {
            throw error;
        }
    }
    // Registra un usuario, regresa error si no puede
    static async registerUser(username, password, usertype){
        const mainSqlQuery = 'INSERT Users(username, userpassword, usertype) VALUES (?, ?, ?)';
        try{
            if (!username && !password)
                throw new Error('Faltan los parametros username y password');
            if (!username)
                throw new Error('Falta el parametro username');
            if (!password)
                throw new Error('Falta el parametro password');
            if (!usertype)
                throw new Error('Falta el parametro usertype');
            if (username.length == 0 || username.length > 30)
                throw new Error('El parametro username no cumple los requisitos de dato');
            if (password.length == 0 || password.length > 100)
                throw new Error('El parametro password no cumple los requisitos de dato');
            if (usertype.length == 0 || usertype.length > 15)
                throw new Error('El parametro usertype no cumple los requisitos de dato');
            // Comprobar si ya existe
            const result = await this.findUser(username);
            if (!result)
                throw new Error("Error en la consulta");
            if (result.length > 0)
                throw new Error("El usuario ya existe");
            // Los datos son correctos, se encripta la contraseña
            password = encryptText(password);
            console.log(password);
            await db.query(mainSqlQuery, [username, password, usertype]);
            return 0;
        } catch (error){
            throw error;
        }
    }
    static async updateUser(username, newPassword, newUsertype){
        const sqlQuery1 = 'UPDATE Users SET userpassword = ? WHERE username = ?';
        const sqlQuery2 = 'UPDATE Users SET usertype = ? WHERE username = ?';
        try {
            // Revisar parametro username
            if (!username)
                throw new Error("Falta el parametro username");
            var changePassword = false;
            var changeUsertype = false;
            if (newPassword){
                if (newPassword.length == 0 || newPassword.length > 100)
                    throw new Error("El parametro password no cumple los requisitos de dato");
                changePassword = true;
            }
            if (newUsertype){
                if (newUsertype.length == 0 || newUsertype.length > 15)
                    throw new Error("El parametro usertype no cumple los requisitos de dato");
                changeUsertype = true;
            }
            if (changePassword == false && changeUsertype == false)
                throw new Error("Falta el parametro password o usertype");
            const result = await this.findUser(username);
            if (!result)
                throw new Error("Error en la consulta");
            if (result.length == 0)
                throw new Error("El registro no existe");
            // Aplicar update
            if (changePassword){
                newPassword = encryptText(newPassword);
                await db.query(sqlQuery1, [newPassword, username]);
            }
            if (changeUsertype)
                await db.query(sqlQuery2, [newUsertype, username]);
        } catch (error) {
            throw error;
        }
    }
    // Elimina un usuario que exista, regresa 1 si hubo error, 0 si no
    static async deleteUser(deletedUser){
        const mainSqlQuery = 'DELETE FROM Users WHERE username = ?';
        try {
            if (!deletedUser)
                throw new Error('Falta el parametro username');
            const exists = await this.findUser(deletedUser);
            if (!exists)
                throw new Error("Error en la consulta");
            if (exists.length == 0)
                throw new Error("El registro no existe");
            await db.query(mainSqlQuery, [deletedUser]);
        } catch (error) {
            throw error;
        }
    }
}

module.exports = userDAO;