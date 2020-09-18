const db = require('./connection');
let {generateAndInsertReviews, generateAndInsertGames} = require('../seed.js');
var faker = require('faker');

// const client = new Client(
//   {
//     user: 'steam',
//     host: 'localhost',
//     database: 'reviews_graph',
//     password: '',
//     port: 5432
//   }
// );

async function seedDB () {
  try {
    await db.query(`CREATE TABLE reviews (reviewId int, date date, reviewText text, reviewScore int, associatedGame int);`);
    await db.query(`CREATE INDEX reviews_date ON reviews (associatedGame, date)`)
    await db.query(`CREATE TABLE games (gameid int, gameName text);`);
    await db.query(`CREATE INDEX game ON games (gameId)`)
    console.log('Tables are successfully created');
    await generateAndInsertReviews(insertReviewsInDB);
    await generateAndInsertGames(insertGamesInDB);
  } catch (err) {
    console.log('Error', err.stack);
  } finally {
    await db.end();
  }
}

//old version of code
// async function seedDB () {
//   try {
//     await client.connect();
//     await client.query(`CREATE TABLE reviews_graph (gameid int, date date, positive int, negative int);`);
//     console.log('Table is successfully created');
//     await generateAndInsertData(insertItemsinDB);
//   } catch (err) {
//     console.log('Error', err.stack);
//   } finally {
//     await client.end();
//   }
// }

async function insertReviewsInDB (data) {
  let games = [];
  let reviewsQuery = `INSERT into reviews (reviewId, date, reviewText, reviewScore, associatedGame) VALUES`;
  let gameQuery = `INSERT into games(gameId, gameName) VALUES`;
  let values = data.map((value) => {
    return `(${value.reviewId}, '${value.date}', '${value.reviewText}', ${value.reviewScore}, ${value.associatedGame})`
  }).join(',');
  await db.query(reviewsQuery + values);
}

async function insertGamesInDB (data) {
  let gameQuery = `INSERT into games(gameId, gameName) VALUES`;
  let values = data.map((value) => {
    return `(${value.gameId}, '${value.gameName}')`
  }).join(',');
  await db.query(gameQuery + values);
}

seedDB()
