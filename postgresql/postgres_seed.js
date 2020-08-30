const {Client } = require('pg');
let generateAndInsertData = require('../seed.js');

const client = new Client(
  {
    user: 'steam',
    host: 'localhost',
    database: 'reviews_graph',
    password: '',
    port: 5432
  }
);

async function seedDB () {
  try {
    await client.connect();
    await client.query(`CREATE TABLE reviews_graph (gameid int, date date, positive int, negative int);`);
    console.log('Table is successfully created');
    await generateAndInsertData(insertItemsinDB);
  } catch (err) {
    console.log('Error', err.stack);
  } finally {
    await client.end();
  }
}

async function insertItemsinDB (data) {
  let query = `INSERT into reviews_graph(gameid, date, positive, negative) VALUES`;
  let values = data.map((value) => {
    return `(${value.gameId}, '${value.date}', ${value.positive}, ${value.negative})`
  }).join(',');

  await client.query(query + values);
}


seedDB()
