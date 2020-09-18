const morgan = require('morgan');
const  newrelic = require('newrelic');
const createApp = require('./index.js');
const db = require('../postgresql/connection.js');

const PORT = 3002;
const app = createApp(db);
app.use(morgan('dev'));

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
