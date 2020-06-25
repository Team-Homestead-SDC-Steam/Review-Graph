const connection = require('./connection.js')
const fs = require('fs')

// a flexible randomizer that takes arrays or numbers and returns a random element from that range
var rnd = n => Array.isArray(n) ? n[ rnd(n.length) - 1] : Math.floor( Math.random() * n ) + 1

var seed_values = () => {
  var values = '';
  // MySQL Date format = YYYY-MM-DD
  for( var game_id = 1; game_id <= 100; game_id++ ) {
    var current_day = new Date();
    var pos_range = rnd(20) + rnd(20);
    var neg_range = rnd(20) - rnd(10); 
    if ( neg_range < 3 ) neg_range = 3;
    for ( var past = 0; past < 365 ; past++ ) {
      // INSERT into reviews_graph (gameid, date, positive, negative) VALUES ...
      values += `(${game_id},'${current_day.toISOString().split("T")[0]}',${rnd(pos_range)},${rnd(neg_range)}),`
      current_day.setDate( current_day.getDate() - 1 )
    }
  }
  //console.log ( values );
  return values.slice(0,-1);
}

var sql = [
  `DROP DATABASE IF EXISTS steam;`,
  `CREATE DATABASE steam;`,
  `USE steam;`,
  `CREATE TABLE reviews_graph (
    id int auto_increment primary key,
    gameid int not null,
    date date, 
    positive int,
    negative int
  );`,
  `INSERT into reviews_graph (gameid, date, positive, negative) VALUES ${ seed_values() };`
]

console.log( 'Beginning seed script for reviews_graph')
Promise.all( 
  sql.map( (sqlText) => {
      new Promise( (resolve, reject) => { 
        connection.query( sqlText, (err, result, fields) => {
          // console.log('\nExecuting sql: ' + sqlText + '\n');
          if (err) throw err;
        })
      })
   })
)
.then(values => { console.log('Data generated successfully.') })
.catch(error => { console.error(error.message) })
connection.end( () => { console.log('Connection closed.') });

/*

SELECT 
SUM(positive) as pos, 
SUM(negative) as neg
FROM reviews_graph
WHERE gameid = 1;

SELECT  
SUM(positive) as pos,  
SUM(negative) as neg 
FROM reviews_graph 
WHERE date >= CURDATE()-30 
AND date <= CURDATE() 
AND gameid = 1;

SELECT 
CONCAT ( Year(date), '-', LPAD( Month(date), 2, '0'), '-01' ) as month, 
SUM(positive) as pos, 
SUM(negative) as neg
FROM reviews_graph
WHERE gameid = 1
GROUP BY month
ORDER BY month;

SELECT 
date, 
positive as pos, 
negative as neg
FROM reviews_graph
WHERE date >= CURDATE()-30
AND date <= CURDATE()
AND gameid = 2
ORDER BY date;

*/