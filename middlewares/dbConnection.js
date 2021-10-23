require('dotenv').config()
const mysql = require('mysql2')

const db_config = {
    host: process.env.AZURE_SERVER_DB_HOST,
    user: process.env.AZURE_SERVER_DB_USER,
    database: process.env.AZURE_SERVER_DB,
    // password:process.env.AZURE_SERVER_DB_PASSWORD
}

let db = mysql.createConnection(db_config)

setInterval(function () {
    db.query("Select 1");
}, 5000);

module.exports = db;