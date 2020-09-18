const morgan = require('morgan');
const  newrelic = require('newrelic');
const createApp = require('./index.js');
const os = require("os");
const cluster = require("cluster");
const db = require('../postgresql/connection.js');

const PORT = 3002;
// const app = createApp(db);
// let app;
// app.use(morgan('dev'));

const clusterWorkerSize = os.cpus().length

if (clusterWorkerSize > 1) {
  if (cluster.isMaster) {
    for (let i = 0; i < clusterWorkerSize; i++) {
      cluster.fork()
    }

    cluster.on("exit", function(worker) {
      console.log("Worker", worker.id, " has exitted.")
    })
  } else {
    const app = createApp(db);
    app.listen(PORT, function () {
      console.log(`Express server listening on port ${PORT} and worker ${process.pid}`)
    })
  }
} else {
  const app = createApp(db);
  app.listen(PORT, function () {
    console.log(`Express server listening on port ${PORT} with the single worker ${process.pid}`)
  })
}

// app.use(morgan('dev'));

// app.listen(PORT, () => {
//   console.log(`listening on port ${PORT}`);
// });
