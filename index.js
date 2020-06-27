/* eslint-disable no-console */
const express = require('express');
const db = require('./db/connection.js');
const utils = require('./utils.js');

const app = express();
const port = 3001;

app.listen(port, () => console.log(`Steam reviews service. listening at http://localhost:${port}`));
app.use(express.static('./client/dist'));

app.get('/api/reviewcount/:gameId', (req, res) => {
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
  const sqlText = 'SELECT SUM(positive) as pos, SUM(negative) as neg '
                  + 'FROM reviews_graph WHERE date >= CURDATE()-30 AND date <= CURDATE() '
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
  const sqlText = 'SELECT CONCAT ( Year(date), \'-\', LPAD( Month(date), 2, \'0\'), \'-\', LPAD( Day(date), 2, \'0\') ) as day, '
                + 'SUM(positive) as pos, SUM(negative) as neg '
                + 'FROM reviews_graph WHERE date >= CURDATE()-30 AND date <= CURDATE() '
                + `AND gameid = ${req.params.gameId} GROUP BY day ORDER BY day;`;
  db.query(sqlText, (err, result) => {
    if (err) { res.status(500).send({ error: 'Internal server error' }); throw err; }
    res.json(JSON.parse(`{"detail": [${result.map((row) => `{"day": "${row.day}", "positive": ${row.pos}, "negative": ${row.neg} }`).slice(0, -1)}]}`));
    // ex. {"detail":[{"day":"2020-06-01","pos":16,"neg":4},{},...]}
  });
});
