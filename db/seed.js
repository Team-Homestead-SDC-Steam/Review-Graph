/* eslint-disable no-console */
const { createConnection } = require('mysql');
const { rnd } = require('../utils');
const config = require('./config');

const db = createConnection(config);

const Seed = {

  runSQLAsPromises(sql = []) {
    // convert array of sql statements to Promises and run in order
    Promise.all(
      sql.map((sqlText) => {
        // eslint-disable-next-line no-new
        new Promise(() => {
          db.query(sqlText, (err) => {
            // console.log('\nExecuting sql: ' + sqlText + '\n');
            if (err) throw err;
          });
        });
        return 'Complete';
      }),
    )
      .then(() => { console.log('Data generated successfully.'); })
      .catch((error) => { console.error(error.message); return false; })
      .then(() => { db.end(() => { console.log('Connection closed.'); return true; }); });
  },

  getInsertSQLByGame(gameID) {
    let values = '';
    // start from today
    const currentDay = new Date();
    // for each game, set up a range/ratio for scores to inhabit
    const posRange = rnd(20) + rnd(20);
    let negRange = rnd(20) - rnd(10);

    // put a floor of 3 on negative reviews, in case randomization does something unexpected
    if (negRange < 3) negRange = 3;

    // start from today's date and go back 365 days
    for (let past = 0; past < 365; past += 1) {
      // INSERT into reviews_graph (gameid, date, positive, negative) VALUES ...
      values += `(${gameID},'${currentDay.toISOString().split('T')[0]}',${rnd(posRange)},${rnd(negRange)}),`;
      // [date].toISOString().split("T")[0] translates a date into MySQL date format (YYYY-MM-DD)

      // shift one day into the past and continue
      currentDay.setDate(currentDay.getDate() - 1);
    }
    return values;
  },

  getInserts() {
    let values = '';
    // do this for each of the first 100 games, by gameID (1-100)
    for (let gameID = 1; gameID <= 100; gameID += 1) {
      values += this.getInsertSQLByGame(gameID);
    }
    // strip off the last extraneous comma
    return values.slice(0, -1);
  },

  generateSQL() {
    return [
      'CREATE DATABASE IF NOT EXISTS steam;',
      'USE steam;',
      'DROP TABLE IF EXISTS reviews_graph;',
      `CREATE TABLE reviews_graph (
        id int auto_increment primary key,
        gameid int not null,
        date date, 
        positive int,
        negative int
      );`,
      `INSERT into reviews_graph (gameid, date, positive, negative) VALUES ${this.getInserts()};`,
    ]; // generate a year's worth of summarized review data for each game
  },

  // eslint-disable-next-line no-unused-vars
  start() {
    console.log('Beginning seed script for reviews_graph');
    this.runSQLAsPromises(this.generateSQL());
  },

};

module.exports = Seed;
