const { randomValue } = require('./seed.js');
const faker = require('faker');
var moment = require('moment');

module.exports = { generateRandomData };

function generateRandomData (userContext, events, done) {
  let reviewId = randomValue(6000000, 6000100);
  let date = moment([2020, 09, 10]).add(randomValue(1, 10), 'days');
  let reviewText = faker.lorem.words();
  let reviewScore = randomValue(1, 10);
  userContext.vars.reviewId = reviewId;
  userContext.vars.date = date;
  userContext.vars.reviewText = reviewText;
  userContext.vars.reviewScore = reviewScore;
  return done();
}
