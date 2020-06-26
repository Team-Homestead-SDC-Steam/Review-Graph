const db = require('./db/connection.js');
const express = require('express');
const app = express();
const port = 3001;

app.listen(port, () => console.log(`Steam reviews service. listening at http://localhost:${port}`))
app.use(express.static('./client/dist'));


// tool: return summary text from %
var rating = per => 
[ { min: 95, text:'Overhwelmingly Positive' },
  { min: 80, text:'Very Positive' },
  { min: 70, text:'Mostly Positive' },
  { min: 40, text:'Mixed' },
  { min: 20, text:'Mostly Negative' },
  { min: 0, text:'Very Negative' } ]
  .find( row => per >= row['min'] )['text'];


app.get('/api/reviewcount/:gameId', ( req, res ) => {

  var sqlText = `SELECT SUM(positive) as pos, SUM(negative) as neg ` +
                `FROM reviews_graph WHERE gameid = ${ req.params.gameId };`;

  db.query( sqlText, ( err, result, fields ) => {
      if (err) throw err;
      var row = result[0],
          pos = row.pos, 
          neg = row.neg, 
          tot = pos + neg, 
          per = Math.floor( pos / tot * 100 ); 
      res.send( `{ summary: '${rating(per)}', percent: ${per}, positive: ${pos}, negative: ${neg}, total: ${tot} }` )
      // ex. { summary: 'Positive', percent: 82, positive: 4677, negative: 1218, total: 77856 }
  })

});


app.get('/api/reviewcount/recent/:gameId', ( req, res ) => {

    var sqlText = `SELECT SUM(positive) as pos, SUM(negative) as neg ` +
                  `FROM reviews_graph WHERE date >= CURDATE()-30 AND date <= CURDATE() ` +
                  `AND gameid = ${ req.params.gameId };`;
  
    db.query( sqlText, ( err, result, fields ) => {
        if (err) throw err;
        var row = result[0],
            pos = row.pos, 
            tot = pos + row.neg, 
            per = Math.floor( pos / tot * 100 ); 
        res.send( `{ summary: '${rating(per)}', percent: ${per}, total: ${tot} }` )
        // ex. { summary: 'Positive', percent: 82, positive: 4677, negative: 1218, total: 77856 }
    })

  });


app.get('/api/reviewcount/detail/:gameId', ( req, res ) => {

  var sqlText = `SELECT CONCAT ( Year(date), '-', LPAD( Month(date), 2, '0'), '-01' ) as month, ` +
                `SUM(positive) as pos, SUM(negative) as neg FROM reviews_graph ` +
                `WHERE gameid = ${ req.params.gameId } GROUP BY month ORDER BY month;`

  db.query( sqlText, (err, result, fields) => {
      if (err) throw err;
      res.send( `{ [ ` + result.map( row => `{ month: '${ row['month'] }', pos: ${ row['pos'] }, neg: ${ row['neg'] } }`).slice( 0, -1 ) + ` ] }`  );
      // ex. { [ { month: '2019-10-01', positive: 4720, negative: 1591} ... ] }
    })
    
});


app.get('/api/reviewcount/recent/detail/:gameId', ( req, res ) => {

  var sqlText = `SELECT CONCAT ( Year(date), '-', LPAD( Month(date), 2, '0'), '-', LPAD( Day(date), 2, '0') ) as day, ` +
                `SUM(positive) as pos, SUM(negative) as neg `+
                `FROM reviews_graph WHERE date >= CURDATE()-30 AND date <= CURDATE() ` +
                `AND gameid = ${ req.params.gameId } GROUP BY day ORDER BY day;`

  db.query( sqlText, (err, result, fields) => {
    if (err) throw err;
    res.send( `{ [ ` + result.map( row => `{ day: '${ row['day'] }', pos: ${ row['pos'] }, neg: ${ row['neg'] } }`).slice( 0, -1 ) + ` ] }`  );
    // ex. {  [ {day: '2020-07-01', positive: 133, negative: 2}, … ] }
  })
});