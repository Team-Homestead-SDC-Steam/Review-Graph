var nano = require('./connection.js');
let {generateAndInsertReviews, generateAndInsertGames} = require('../seed.js');
const reviews_graph = nano.db.use('reviews_graph');

async function insertItemsInDb(documents) {
  let resp = await reviews_graph.bulk({ docs:documents })
}

async function seedDB () {
  try {
    await reviews_graph.createIndex({index: {fields: ["gameId"]}})
    await reviews_graph.createIndex({index: {fields: ["associatedGame", "date"]}})
    await generateAndInsertGames(insertItemsInDb);
    await generateAndInsertReviews(insertItemsInDb);
  } catch (err) {
    console.log('Error', err.stack);
  }
}

seedDB()
