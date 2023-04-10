require('dotenv').config();
const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: process.env.DB_PASSWORD,
  database: 'mysql-employee-db'
});

connection.connect(function (err) {
  if (err) throw err;
});

module.exports = connection;
