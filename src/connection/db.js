const mysql = require('mysql2/promise');

class DB {
    constructor() {
        this.pool = mysql.createPool({
            host: "localhost",
            user: "root",
            password: "1234",
            database: "booksCenter",
            waitForConnections: true,
            connectionLimit: 10,   // Número máximo de conexiones simultáneas
            queueLimit: 0          // Número máximo de conexiones en espera (0 para ilimitado)
        });
    }

    async query(sql, params = []) {
        try {
            const [results, fields] = await this.pool.execute(sql, params);
            return results;
        } catch (err) {
            console.error('Error en la consulta:', err);
            throw err;
        }
    }

    async closePool() {
        await this.pool.end();
        console.log('Pool de conexiones cerrado');
    }
}

module.exports = new DB();