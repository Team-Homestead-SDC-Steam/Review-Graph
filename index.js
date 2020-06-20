const express = require('express')
const app = express()
const port = 3001

// app.get('/', (req, res) => res.send('Steam reviews service?'))

app.listen(port, () => console.log(`Steam reviews service. listening at http://localhost:${port}`))
app.use(express.static('./client/dist'));

// SAMPLE API CALLS

app.get('/api/reviewcount/all/summary/:productId', ( req, res) => {
    res.send( sampleAllSummary );
});

app.get('/api/reviewcount/all/:productId', ( req, res) => {
  res.send( sampleAll );
});

app.get('/api/reviewcount/recent/summary/:productId', ( req, res) => {
  res.send( sampleRecentSummary );
});

app.get('/api/reviewcount/recent/:productId', ( req, res) => {
  res.send( sampleRecent );
});

var sampleAllSummary = { summary: 'Positive', total: 77856 }
var sampleRecentSummary = { summary: 'Very Positive', total: 246 }

// converts from MySQL DATETIME: {2019-10-31 0:00:00}

var sampleAll = { summary: 'Positive', total: 77856, detail: [
	{month: '2019-10-01 0:00:00', positive: 4720, negative: 1591},
  {month: '2019-11-01 0:00:00', positive: 5980, negative: 1042} ]}

var sampleRecent = { summary: 'Very Positive', total: 246, detail: [
  {month: '2020-07-01 0:00:00', positive: 133, negative: 0},
  {month: '2020-07-02 0:00:00', positive: 113, negative: 3} ]}  