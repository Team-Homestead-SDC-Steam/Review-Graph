const db = require('../postgresql/connection.js');
const express = require('express');
const path = require('path');
const cors = require('cors');
const utils = require('../utils.js');
var bodyParser = require('body-parser');
var moment = require('moment');
const redis = require("redis");

async function getReviewCountByDay(gameId, positive) {
  let query =
    `SELECT count(*) as count, reviews.date as day from games, reviews
      where games.gameId=reviews.associatedGame
      and gameId=$1
      and ${positive ? 'reviewScore > 5' : 'reviewScore <= 5'}
      and reviews.date between now() - interval '1 month' and now()
      group by day order by day;`;

  const results = await db.query(query, [gameId]);
  return results.rows.map(row => ({
    day: moment(row.day).format('YYYY-MM-DD'),
    count: Number(row.count)
  }));
}

async function getReviewCountByMonth(gameId, positive) {
  let query =
    `SELECT count(*) as count, date_trunc('month', date) from games, reviews
      where games.gameId=reviews.associatedGame
      and gameId=$1
      and ${positive ? 'reviewScore > 5' : 'reviewScore <= 5'}
      group by date_trunc('month', date);`

  const results = await db.query(query, [gameId]);
  return results.rows.map(row => ({
    month: moment(row.date_trunc).format('YYYY-MM-DD'),
    count: Number(row.count)
  }));
}

function createApp() {
  const port_redis = process.env.PORT || 6379;
  const redis_client = redis.createClient(port_redis);
  const app = express();
  app.use(express.static(path.join(__dirname, '../client/dist')));
  app.use(bodyParser.json());

  let checkCache = (prefix) => {
    return (req, res, next) => {
      const id = req.params.gameId;
      console.log(req.params.gameId)

      redis_client.get(`${prefix}-${id}`, (err, data) => {
        if (err) {
          console.log(err);
          res.status(500).send(err);
        }
        if (data != null) {
          console.log('Here!!!')
          res.type('json').send(data);
        } else {
          next();
        }
      });
    };
  };

  app.get('/app/:gameId', (req, res) => {
    res.sendFile(path.join(__dirname, '../client', 'dist', 'index.html'));
  });

  app.get('/api/reviewcount/:gameId', checkCache('reviewcount'), async (req, res) => {
    let positive =
      `SELECT count(*) as count
      from games, reviews
      where games.gameId=reviews.associatedGame
      and gameId=$1
      and reviewScore > 5;`

    let negative =
      `SELECT count(*) as count
      from games, reviews
      where games.gameId=reviews.associatedGame
      and gameId=$1
      and reviewScore <= 5;`

    const positivePromise = db.query(positive, [req.params.gameId]);
    const negativePromise = db.query(negative, [req.params.gameId]);
    let [positiveReviews, negativeReviews] = await Promise.all([positivePromise, negativePromise]);
    let positiveCount = Number(positiveReviews.rows[0].count);
    let negativeCount = Number(negativeReviews.rows[0].count);
    let total = positiveCount + negativeCount;
    let percent = Math.floor((positiveCount/total) * 100);
    redis_client.setex(`reviewcount-${req.params.gameId}`, 3600, JSON.stringify({summary: utils.rating(percent), percent, positive: positiveCount, negative: negativeCount, total}));
    res.status(200).send({summary: utils.rating(percent), percent, positive: positiveCount, negative: negativeCount, total})
  });

  app.get('/api/reviewcount/recent/:gameId', checkCache('reviewcountRecent'), async (req, res) => {
    let positive =
      `SELECT count(*) as count
        from games, reviews
        where games.gameId=reviews.associatedGame
        and gameId=$1
        and reviewScore > 5
        and reviews.date between now() - interval '1 month' and now();`

    let negative =
      `SELECT count(*) as count
      from games, reviews
      where games.gameId=reviews.associatedGame
      and gameId=$1
      and reviewScore <= 5
      and reviews.date between now() - interval '1 month' and now();`

    const positivePromise = db.query(positive, [req.params.gameId]);
    const negativePromise = db.query(negative, [req.params.gameId]);
    let [positiveReviews, negativeReviews] = await Promise.all([positivePromise, negativePromise]);
    let positiveCount = Number(positiveReviews.rows[0].count);
    let negativeCount = Number(negativeReviews.rows[0].count);
    let total = positiveCount + negativeCount;
    let percent = Math.floor((positiveCount/total) * 100);
    redis_client.setex(`reviewcountRecent-${req.params.gameId}`, 3600, JSON.stringify({summary: utils.rating(percent), percent, total}));
    res.status(200).send({summary: utils.rating(percent), percent, total})
  });

  app.get('/api/reviewcount/recent/detail/:gameId', checkCache('detailRecent'), async (req, res) => {
    try {
      const positivePromise = getReviewCountByDay(req.params.gameId, true);
      const negativePromise = getReviewCountByDay(req.params.gameId, false);
      let [positiveReviews, negativeReviews] = await Promise.all([positivePromise, negativePromise]);
      const results = {};
      for (let {day, count} of positiveReviews) {
        results[day] = {day, positive: count, negative: 0};
      }
      for (let {day, count} of negativeReviews) {
        const result = results[day] || {day, positive: 0};
        results[day] = {...result, negative: count};
      }
      redis_client.setex(`detailRecent-${req.params.gameId}`, 3600, JSON.stringify({detail: Object.values(results)}));
      res.status(200).send({detail: Object.values(results)});
    }
    catch(err) {
      console.log(err)
      res.sendStatus(500);
    }
  });

  app.get('/api/reviewcount/detail/:gameId', checkCache('detail'), async (req, res) => {
    try {
      const positivePromise = getReviewCountByMonth(req.params.gameId, true);
      const negativePromise = getReviewCountByMonth(req.params.gameId, false);
      let [positiveReviews, negativeReviews] = await Promise.all([positivePromise, negativePromise]);
      const results = {};
      for (let {month, count} of positiveReviews) {
        results[month] = {month, positive: count, negative: 0};
      }
      for (let {month, count} of negativeReviews) {
        const result = results[month] || {month, positive: 0};
        results[month] = {...result, negative: count};
      }
      redis_client.setex(`detail-${req.params.gameId}`, 3600, JSON.stringify({detail: Object.values(results)}));
      res.status(200).send({detail: Object.values(results)});
    }
    catch(err) {
      console.log(err)
      res.sendStatus(500);
    }
  });

  app.post('/api/reviewcount/detail/:gameId/:date', (req, res) => {
    db.query(
      `INSERT INTO reviews(reviewId, date, reviewText, reviewScore, associatedGame) VALUES($1, $2, $3, $4, $5)`,
      [req.body.reviewId, req.params.date, req.body.reviewText, req.body.reviewScore, req.params.gameId],
      (err, result) => {
        if (err) {
          console.log(err);
          res.sendStatus(500);
        } else {
          console.log('Inserted new item');
          res.sendStatus(201);
        }
    })
  })

  app.put('/api/reviewcount/detail/:gameId/:date', (req, res) => {
    db.query(
      `UPDATE reviews SET date=$1, reviewText=$2, reviewScore=$3 WHERE reviewId=$4`,
      [req.params.date, req.body.reviewText, req.body.reviewScore, req.body.reviewId],
      (err, result) => {
        if (err) {
          console.log(err);
          res.sendStatus(500);
        } else if (result.affectedRows === 0) {
          res.sendStatus(404);
        } else {
          console.log('Updated item');
          res.sendStatus(204);
        }
    })
  })



  return app;
}

module.exports = createApp;
