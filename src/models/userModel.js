const db = require('../connection/db');

class userModel {
    constructor(username, password, usertype){
        this.username = username;
        this.password = password;
        this.usertype = usertype;
    }
    static async findAllUsers(){
        const sqlQuery = 'SELECT username, usertype FROM Users';
        return await db.query(sqlQuery);
    }
    // Regresa un arreglo de diccionarios si encuentra un usuario en base a un nombre
    static async findUser(inputUsername){
        const sqlQuery = 'SELECT username, userpassword, usertype FROM Users WHERE username = ?;'
        return await db.query(sqlQuery, [inputUsername]);
    }
    // Regresa 0 si se puede crear un usuario con los parametros especificados, regresa 1 si no
    static async registerUser(currentUsername, newUsername, newHashedPassword, newUsertype){
        const auxSqlQuery1 = 'SELECT username FROM Users WHERE username = ?';
        const mainSqlQuery = 'INSERT Users(username, userpassword, usertype) VALUES (?, ?, ?)';

        const user = await db.query(auxSqlQuery1, [newUsername]);
        if (user.length > 0)
            return 1;
        else{
            await db.query(mainSqlQuery, [newUsername, newHashedPassword, newUsertype]);
            return 0;
        }
    }
    // Revisa si existe un usuario y cambia su contraseña, regresa 1 si hubo error, 0 si no
    static async updatePassword(newHashedPassword, currentUsername){
        const mainSqlQuery = 'UPDATE Users SET userpassword = ? WHERE username = ?';
        const exists = await this.findUser(currentUsername);

        if (!exists || exists.length == 0)
            return 1;

        try {
            await db.query(mainSqlQuery, [newHashedPassword, currentUsername]);
            return 0;
        } catch (error) {
               return 1;
        }
    }
    // Revisa si existe un usuario y cambia su usertype, regresa 1 si hubo error, 0 si no
    static async updateUsertype(newUsertype, currentUsername){
        const mainSqlQuery = 'UPDATE Users SET usertype = ? WHERE username = ?';
        const exists = await this.findUser(currentUsername);

        if (!exists || exists.length == 0)
            return 1;
        try {
            await db.query(mainSqlQuery, [newUsertype, currentUsername]);
            return 0;   
        } catch (error) {
            return 1;
        }
    }
}

module.exports = userModel;