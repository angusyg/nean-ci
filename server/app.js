/**
 * @fileoverview Express application
 * @module app
 * @requires {@link external:express}
 * @requires {@link external:body-parser}
 * @requires {@link external:express-x-hub}
 * @requires {@link external:express-pino-logger}
 * @requires {@link external:uuid/v4}
 * @requires {@link external:helmet}
 * @requires {@link external:cors}
 * @requires config/app
 * @requires helpers/errorhandler
 * @requires helpers/logger
 * @requires routes/webhook
 */

const express = require('express');
const bodyParser = require('body-parser');
const xhub = require('express-x-hub');
const pino = require('express-pino-logger');
const uuidv4 = require('uuid/v4');
const helmet = require('helmet');
const cors = require('cors');
const config = require('./config/app');
const errorHandler = require('./helpers/errorhandler');
const { logger } = require('./helpers/logger')();
const webhookRouter = require('./routes/webhook');

const app = express();

// Github XHUB middleware
app.use(xhub({
  algorithm: config.xhubAlgorithm,
  secret: config.xhubSecret,
}));

// Logger middleware
app.use(pino({
  logger,
  genReqId: () => uuidv4(),
}));

// Security middlewares
app.use(helmet());
app.use(cors(config.crossOrigin));

// Body parser (to json) middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Map modules routes
app.use('/webhook', webhookRouter);

// Default error handlers
app.use(errorHandler.errorNoRouteMapped);
app.use(errorHandler.errorHandler);

// Server launch
const server = app.listen(config.port, () => {
  logger.info('Continuous Integration server started, listening on %s', config.port);
  // For tests
  app.emit('appStarted');
  // For pm2
  if (process.env.PM2) process.send('ready');
});

/**
 * Gracefully close application server, waiting for opened
 * requests to end and force close after 5s timeout
 * @function gracefulShutdown
 * @private
 */
function gracefulShutdown() {
  logger.info('Closing application server ...');

  server.close(() => {
    logger.info('Application server closed');
    process.exit(0);
  });

  // Force close server after 5secs
  setTimeout((e) => {
    logger.info('Application server closed', e);
    process.exit(1);
  }, 5000);
}

// Catch signals to gracefull quit
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

module.exports = app;
