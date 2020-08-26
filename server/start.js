const morgan = require('morgan');
const createApp = require('./index.js');
const db = require('../db/connection.js');

const PORT = 3002;
const app = createApp(db);
app.use(morgan('dev'));

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
