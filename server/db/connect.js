var mysql = require('mysql');
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Meimima!23',
  database: 'vantstore'
});

connection.connect();

module.exports = connection;
