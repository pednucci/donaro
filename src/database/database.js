require('dotenv/config')
const mysql = require('mysql2/promise');

async function connection(){
    const connect = await mysql.createConnection({
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        port: 3306
    })
    return connect;
}

module.exports = {connection};