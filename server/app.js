/**
 * Main application file
 */

const express = require('express');
const mongoose = require('mongoose');
const config = require('./config/environment');
const http = require('http');

const expressConfig = require('./config/express');
const registerRoutes = require('./routes');

mongoose.Promise = require('bluebird');
// const seedDatabaseIfNeeded = require('./config/seed');


// Connect to MongoDB
const mongooseConnectionPromise = mongoose.connect(config.mongo.uri, config.mongo.options);
mongoose.connection.on('error', (err) => {
  console.error(`MongoDB connection error: ${err}`);
  process.exit(-1); // eslint-disable-line no-process-exit
});

mongoose.connection.on('open', () => {
    console.log('MongoDB connected');
});

// Setup server
const app = express();
const server = http.createServer(app);

expressConfig(app);
registerRoutes(app);

// Start server
function startServer() {
  app.angularFullstack = server.listen(config.port, config.ip, () => {
    console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
  });
}


setImmediate(startServer);

// Expose app
exports = module.exports = app;
