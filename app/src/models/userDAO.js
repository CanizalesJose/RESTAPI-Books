const db = require('../connection/db');
const {encryptText, newError} = require('../utils');
const bcrypt = require('bcrypt');

class userDAO {
    static async findAllUsers(){
        const sqlQuery = 'SELECT username, usertype, contactNumber, email, penalized FROM Users';
        try {
            const results = await db.query(sqlQuery);
            if (!results)
                throw newError(500, 'Error en la consulta');
            return results;
        } catch (error) {
            throw error;
        }
    }
    // Regresa un arreglo de diccionarios si encuentra un usuario en base a un nombre
    static async findUser(username){
        const sqlQuery = 'SELECT username, userpassword, usertype, contactNumber, email, penalized FROM Users WHERE username = ?;'
        try {
            if (!username)
                throw newError(400, "Falta parametro username");
            if (username.length == 0 || username.length > 30)
                throw newError(400, "El username no cumple los requisitos de longitud");
            const result = await db.query(sqlQuery, [username]);
            if (!result)
                throw newError(500, "Error en la consulta");
            return result;
        } catch (error) {
            throw error;
        }
    }
    // Registra un usuario, regresa error si no puede
    static async registerUser(username, password, usertype, contactNumber, email){
        const mainSqlQuery = 'INSERT Users(username, userpassword, usertype, contactNumber, email) VALUES (?, ?, ?, ?, ?)';
        try{
            if (!username)
                throw newError(400, 'Falta el parametro username');
            if (!password)
                throw newError(400, 'Falta el parametro password');
            if (!usertype)
                throw newError(400, 'Falta el parametro usertype');
            if (!contactNumber)
                throw newError(400, 'Falta el parametro contactNumber');
            if (!email)
                throw newError(400, 'Falta el parametro email');
            if (username.length == 0 || username.length > 30)
                throw newError(400, 'El parametro username no cumple los requisitos de longitud');
            if (password.length == 0 || password.length > 100)
                throw newError(400, 'El parametro password no cumple los requisitos de longitud');
            if (usertype.length == 0 || usertype.length > 15)
                throw newError(400, 'El parametro usertype no cumple los requisitos de longitud');
            if (contactNumber.length == 0 || contactNumber.length > 12)
                throw newError(400, 'El parametro contactNumber no cumple los requisitos de longitud');
            if (!/^[0-9]{10}|[0-9]{3}-[0-9]{3}-[0-9]{4}$/.test(contactNumber))
                throw newError(400, 'El numero de contacto no cumple con ninguno de los formatos');
            if (email.length == 0 || email.length > 100)
                throw newError(400, 'El parametro email no cumple los requisitos de longitud');
            if (!/^[a-zA-Z0-9]+\@[a-zA-Z0-9]+\.[a-zA-Z0-9]+$/.test(email))
                throw newError(400, 'El correo no cumple con el formato estándar');
            // Comprobar si ya existe
            const result = await this.findUser(username);
            if (!result)
                throw newError(500, "Error en la consulta");
            if (result.length > 0)
                throw newError(400, "El usuario ya existe");
            // Los datos son correctos, se encripta la contraseña
            password = encryptText(password);
            await db.query(mainSqlQuery, [username, password, usertype, contactNumber, email]);
        } catch (error){
            throw error;
        }
    }
    static async updateUser(username, newPassword, newUsertype, newContactNumber, newEmail){
        const sqlQuery1 = 'UPDATE Users SET userpassword = ?, usertype = ?, contactNumber = ?, email = ? WHERE username = ?';
        const sqlQuery2 = 'UPDATE Users SET usertype = ?, contactNumber = ?, email = ? WHERE username = ?'
        try {
            var changePassword = false;
            // Revisar parametro username
            if (!username)
                throw newError(400, "Falta el parametro username");
            if (newPassword){
                if (newPassword.length == 0 || newPassword.length > 100)
                    throw newError(400, 'La contraseña no cumple los requisitos de longitud');
                changePassword = true;
                newPassword = encryptText(newPassword);
            }
            if (!newUsertype)
                throw newError(400, 'Falta el parametro usertype');
            if (newUsertype.length == 0 || newUsertype.length > 15)
                throw newError(400, 'El tipo de usuario no cumple los requisitos de longitud');
            if (!newContactNumber)
                throw newError(400, 'Falta el parametro contactNumber');
            if (newContactNumber.length == 0 || newContactNumber.length > 12)
                throw newError(400, 'El numero de contacto no cumple los requisitos de longitud');
            if (!/^[0-9]{10}|[0-9]{3}-[0-9]{3}-[0-9]{4}$/.test(newContactNumber))
                throw newError(400, 'El numero de contacto no cumple con ninguno de los formatos');
            if (!newEmail)
                throw newError(400, 'Falta el parametro email');
            if (newEmail.length == 0 || newEmail.length > 100)
                throw newError(400, 'El correo no cumple los requisitos de longitud');
            if (!/^[a-zA-Z0-9]+\@[a-zA-Z0-9]+\.[a-zA-Z0-9]+$/.test(newEmail))
                throw newError(400, 'El correo no cumple el formato estándar.');
            if (changePassword)
                await db.query(sqlQuery1, [newPassword, newUsertype, newContactNumber, newEmail, username]);
            if (!changePassword)
                await db.query(sqlQuery2, [newUsertype, newContactNumber, newEmail, username]);
        } catch (error) {
            throw error;
        }
    }
    // Actualiza un usuario sin usar privilegios de administrador
    static async updateUserClient(username, contactNumber, email, password, currentPassword){
        const sqlQuery1 = 'UPDATE Users SET userpassword = ?, contactNumber = ?, email = ? WHERE username = ?';
        const sqlQuery2 = 'UPDATE Users SET contactNumber = ?, email = ? WHERE username = ?';
        try {
            var changePassword = false;
            // Revisar parametro username
            if (!username)
                throw newError(400, "Falta el parametro username");
            if (!currentPassword)
                throw newError(400, "Falta la contraseña actual");
            if (password){
                if (password.length == 0 || password.length > 100)
                    throw newError(400, 'La contraseña no cumple los requisitos de longitud');
                await this.loginAux(username, currentPassword)
                changePassword = true;
                password = encryptText(password);
            }
            if (!contactNumber)
                throw newError(400, 'Falta el parametro contactNumber');
            if (contactNumber.length == 0 || contactNumber.length > 12)
                throw newError(400, 'El numero de contacto no cumple los requisitos de longitud');
            if (!/^[0-9]{10}|[0-9]{3}-[0-9]{3}-[0-9]{4}$/.test(contactNumber))
                throw newError(400, 'El numero de contacto no cumple con ninguno de los formatos');
            if (!email)
                throw newError(400, 'Falta el parametro email');
            if (email.length == 0 || email.length > 100)
                throw newError(400, 'El correo no cumple los requisitos de longitud');
            if (!/^[a-zA-Z0-9]+\@[a-zA-Z0-9]+\.[a-zA-Z0-9]+$/.test(email))
                throw newError(400, 'El correo no cumple el formato estándar.');
            if (changePassword)
                await db.query(sqlQuery1, [password, contactNumber, email, username]);
            if (!changePassword)
                await db.query(sqlQuery2, [contactNumber, email, username]);
        } catch (error) {
            throw error;
        }
    }
    // Elimina un usuario que exista, regresa 1 si hubo error, 0 si no
    static async deleteUser(deletedUser){
        const mainSqlQuery = 'DELETE FROM Users WHERE username = ?';
        try {
            if (!deletedUser)
                throw newError(400, 'Falta el parametro username');
            const exists = await this.findUser(deletedUser);
            if (!exists)
                throw newError(400, "Error en la consulta");
            if (exists.length == 0)
                throw newError(400, "El registro no existe");
            await db.query(mainSqlQuery, [deletedUser]);
        } catch (error) {
            throw error;
        }
    }
    // Comprueba las credenciales de un usuario
    static async loginAux(username, password){
        try {
            if (!username)
                throw newError(400, 'Falta el parametro username');
            if (!password)
                throw newError(400, 'Falta el parametro password');
            let user = await this.findUser(username);
            if (!user)
                throw newError(500, 'Error interno en la consulta');
            if (user.length == 0)
                throw newError(400, 'Credenciales invalidas');
            user = user[0];
            if (!bcrypt.compareSync(password, user.userpassword))
                throw newError(400, 'Credenciales invalidas');
            return true;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = userDAO;