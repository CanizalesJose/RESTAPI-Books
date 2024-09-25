const mysql = require('mysql2/promise');

class DB {
    constructor() {
        this.pool = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            charset: 'utf8mb4',
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });
    }

    async query(sql, params = []) {
        try {
            const [results, fields] = await this.pool.execute(sql, params);
            return results;
        } catch (err) {
            throw err;
        }
    }

    async closePool() {
        await this.pool.end();
    }
}

module.exports = new DB();