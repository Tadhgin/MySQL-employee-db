const mysql = require("mysql");
require('dotenv').config();

const connection = mysql.createConnection({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to database: ", err.stack);
    return;
  }
  console.log("Connected to database as id ", connection.threadId);
});

module.exports = connection;