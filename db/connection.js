var mysql = require('mysql');
var config = require('./config');

var connection = mysql.createConnection( config );

connection.connect(function(err) {
  if (err) throw err;
  console.log("Connected to MySQL Database");
});

module.exports = connection;