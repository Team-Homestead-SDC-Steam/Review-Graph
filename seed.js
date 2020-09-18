var moment = require('moment');
var fs = require('fs');
var faker = require('faker');

function rand(min, max) {
  let randomNum = (Math.random() * (max - min) + min).toFixed(2);
  return randomNum;
}

function randomValue(min, max) {
  let randomNum = Math.random() * (max - min) + min;
  return Math.floor(randomNum);
};


let randomProperty = (obj)  => {
    var keys = Object.keys(obj);
    let ind = randomValue(0, keys.length);
    return obj[keys[ind]];
};

const reviewsRates = {
  'Overwhelmingly Positive': {min: 0.95, max: 1},
  'Very Positive': {min: 0.8, max: 0.94},
  'Mostly Positive': {min: 0.7, max: 0.79},
  'Mixed': {min: 0.4, max: 0.69},
  'Mostly Negative': {min: 0.2, max: 0.39},
  'Very Negative': {min: 0, max: 0.19}
}

async function generateAndInsertReviews (callback) {
  let gamesArray = [];
  let reviewId = 1;
  for (let gameId = 9990000; gameId < 10000000; gameId++) {
    let rate = randomProperty(reviewsRates);
    for (let d = 0; d < 50; d++) {
      let date = (moment([2020, 07, 10]).add(d, 'days'))
      let numOfReviews = randomValue(3, 21);
      for (let review = 0; review < numOfReviews; review++) {
        gamesArray.push({reviewId: reviewId, date: date.format(), reviewText: faker.lorem.words(), reviewScore: randomValue(1, 10), associatedGame: gameId});
        reviewId += 1;
      }
    }
    if (gamesArray.length > 5000) {
      await callback(gamesArray);
      gamesArray = [];
    }
  }
  if (gamesArray.length > 0) {
    await callback(gamesArray);
  }
}

async function generateAndInsertGames(callback) {
  let gamesArray = [ ...Array(10000000).keys() ].map( i => i+1).map((val) => {
    return {gameId: val, gameName: faker.lorem.words()}
  });
  let chunk = 5000;
  for (let i = 0; i < gamesArray.length; i += chunk) {
    await callback(gamesArray.slice(i, i+ chunk));
  }
}

module.exports.randomValue = randomValue;
module.exports.generateAndInsertReviews = generateAndInsertReviews;
module.exports.generateAndInsertGames = generateAndInsertGames;
