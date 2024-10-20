const mysql = require('mysql2/promise');
const {newError} = require('../utils');

class DB {
    constructor() {
        this.pool = mysql.createPool({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '1234',
            database: process.env.DB_NAME || 'booksCenter',
            charset: 'utf8mb4',
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });
    }

    async query(sql, params = []) {
        try {
            const [results] = await this.pool.execute(sql, params);
            return results;
        } catch (err) {
            if (err.code == 'ECONNREFUSED')
                throw newError(500, 'Problemas en la conexión a base de datos');
            throw err;
        }
    }

    async closePool() {
        await this.pool.end();
    }
}

module.exports = new DB();