require('dotenv').config()
const mysql = require("mysql");
var connection = mysql.createConnection({
    // Connection
    host: "localhost",
    port: 3306,
    // MySQL Workbench
    user: "root",
    password: process.env.DB_PASSWORD,
    // Database created in schemea.sql
    database: "mysql-employee-db",
});

// connect to the mysql server and database
connection.connect(function (err) {
	if (err) throw err;
});

module.exports = connection;
