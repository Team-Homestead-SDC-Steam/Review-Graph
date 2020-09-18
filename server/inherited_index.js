/* eslint-disable no-console */
const express = require('express');
const path = require('path');
const cors = require('cors');
const utils = require('../utils.js');
var bodyParser = require('body-parser');

function createApp(db) {
  const app = express();
  app.use(bodyParser.json());

  app.use(cors());
  app.use(express.static(path.join(__dirname, '../client/dist')));

  app.get('/app/:gameId', (req, res) => {
    res.sendFile(path.join(__dirname, '../client', 'dist', 'index.html'));
  });

  app.get('/api/reviewcount/:gameId', (req, res) => {
    if (!req.params.gameId) res.status(400).send('This API requires a game ID (/api/reviews/:gameId)');
    const sqlText = 'SELECT SUM(positive) as pos, SUM(negative) as neg '
                  + `FROM reviews_graph WHERE gameid = ${req.params.gameId};`;
    db.query(sqlText, (err, result) => {
      if (err) { res.status(500).send({ error: 'Internal server error' }); throw err; }
      const row = result[0];
      const { pos } = row;
      const { neg } = row;
      const tot = pos + neg;
      const per = Math.floor((pos / tot) * 100);
      res.json(JSON.parse(`{"summary": "${utils.rating(per)}", "percent": ${per}, "positive": ${pos}, "negative": ${neg}, "total": ${tot}}`));
      // ex. {"summary":"Mixed","percent":64,"positive":3750,"negative":2059,"total":5809}
    });
  });

  app.get('/api/reviewcount/recent/:gameId', (req, res) => {
    if (!req.params.gameId) res.status(400).send('This API requires a game ID (/api/reviews/recent/:gameId)');
    const sqlText = 'SELECT SUM(positive) as pos, SUM(negative) as neg '
                    + 'FROM reviews_graph WHERE date >= DATE_SUB(CURDATE(),INTERVAL 30 DAY)  '
                    + `AND gameid = ${req.params.gameId};`;
    db.query(sqlText, (err, result) => {
      if (err) { res.status(500).send({ error: 'Internal server error' }); throw err; }
      const row = result[0];
      const { pos } = row;
      const tot = pos + row.neg;
      const per = Math.floor((pos / tot) * 100);
      res.json(JSON.parse(`{"summary": "${utils.rating(per)}", "percent": ${per}, "total": ${tot}}`));
      // ex. {"summary":"Mixed","percent":63,"total":393}
    });
  });

  app.get('/api/reviewcount/detail/:gameId', (req, res) => {
    if (!req.params.gameId) res.status(400).send('This API requires a game ID (/api/reviews/detail/:gameId)');
    const sqlText = 'SELECT CONCAT ( Year(date), \'-\', LPAD( Month(date), 2, \'0\'), \'-01\' ) as month, '
                + 'SUM(positive) as pos, SUM(negative) as neg FROM reviews_graph '
                + `WHERE gameid = ${req.params.gameId} GROUP BY month ORDER BY month;`;
    db.query(sqlText, (err, result) => {
      if (err) { res.status(500).send({ error: 'Internal server error' }); throw err; }
      res.json(JSON.parse(`{"detail": [${result.map((row) => `{"month": "${row.month}", "positive": ${row.pos}, "negative": ${row.neg} }`).slice(0, -1)}]}`));
      // ex. {"detail":[{"month":"2019-06-01","pos":21,"neg":7},{},...]}
    });
  });

  app.get('/api/reviewcount/recent/detail/:gameId', (req, res) => {
    if (!req.params.gameId) res.status(400).send('This API requires a game ID (/api/reviews/recent/detail/:gameId)');
    const sqlText = 'SELECT CONCAT ( Year(date), \'-\', LPAD( Month(date), 2, \'0\'), \'-\', LPAD( Day(date), 2, \'0\') ) as day, '
                  + 'SUM(positive) as pos, SUM(negative) as neg '
                  + 'FROM reviews_graph WHERE date >= DATE_SUB(CURDATE(),INTERVAL 30 DAY) '
                  + `AND gameid = ${req.params.gameId} GROUP BY day ORDER BY day;`;
    db.query(sqlText, (err, result) => {
      if (err) { res.status(500).send({ error: 'Internal server error' }); throw err; }
      res.json(JSON.parse(`{"detail": [${result.map((row) => `{"day": "${row.day}", "positive": ${row.pos}, "negative": ${row.neg} }`).slice(0, -1)}]}`));
      // ex. {"detail":[{"day":"2020-06-01","pos":16,"neg":4},{},...]}
    });
  });

  app.post('/api/reviewcount/:gameId/:date', (req, res) => {
    db.query(
      `INSERT I
       positive=?, negative=?`,
      [req.params.gameId, req.params.date, req.body.positive, req.body.negative],
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

  app.put('/api/reviewcount/:gameId/:date', (req, res) => {
    db.query(
      `UPDATE reviews_graph SET positive=?, negative=? WHERE gameid=? and date=?`,
      [req.body.positive, req.body.negative, req.params.gameId, req.params.date],
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

  app.get('/api/reviewcount/:gameId/:date', (req, res) => {
    db.query(
      `SELECT * FROM reviews_graph WHERE gameid=? and date=?`,
      [req.params.gameId, req.params.date],
      (err, result) => {
        if (err) {
          console.log(err);
          res.sendStatus(500);
        } else {
          console.log('Retrieved item');
          res.status(200).send(result);
        }
    })
  })

  app.delete('/api/reviewcount/:gameId/:date', (req, res) => {
    db.query(
      `DELETE FROM reviews_graph WHERE gameid=? AND date=?`,
      [req.params.gameId, req.params.date],
      (err, result) => {
        if (err) {
          console.log(err);
          res.sendStatus(500);
        } else if (result.affectedRows === 0) {
          res.sendStatus(404);
        } else {
          console.log('Deleted item');
          res.sendStatus(204);
        }
    })
  })
  return app;
}

module.exports = createApp;
