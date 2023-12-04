const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '40028922',
  database: 'dbApiMundoRetro',
});

module.exports = connection;
