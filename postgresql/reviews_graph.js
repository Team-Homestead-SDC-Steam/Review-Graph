const client = require('./connection.js')

async seedDB () => {
  try {
    await client.query(`CREATE TABLE reviews_graph (gameid int, date date, postitive int, negative int);`);
    console.log('Table is successfully created');
    await 
  } catch (err) {
    console.log(err.stack);
  } finally {
    client.close();
  }
}
