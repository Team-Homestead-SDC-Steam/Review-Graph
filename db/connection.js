const mysql = require('mysql');
const config = require('./config');

const connection = mysql.createConnection(config);

connection.connect((err) => {
  if (err) throw err;
  // eslint-disable-next-line no-console
  console.log('Connected to MySQL Database');
});

module.exports = connection;
