const { Client } = require('pg');

const db = new Client({
    user: 'steam',
    host: 'localhost',
    database: 'reviews_graph',
    password: '',
    port: 5432,
});

db.connect();

module.exports = db;
