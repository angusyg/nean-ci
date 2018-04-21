/**
 * @fileoverview Security middlewares to check request validity
 * @module helpers/security
 * @requires helpers/logger
 * @requires models/error/invalidrequest
 */
const { logger } = require('./logger')();
const InvalidRequestError = require('../models/error/invalidrequest');

const security = {};

/**
 * Checks if the request contains a valid X-Hub header
 * @method checkXHub
 * @param  {external:Request}   req  - Request received
 * @param  {external:Response}  res  - Response to be send
 * @param  {nextMiddleware}     next - Callback to pass control to next middleware
 */
security.checkXHub = (req, res, next) => {
  if (req.isXHub) {
    if (!req.isXHubValid()) {
      logger.warn('Invalid X-Hub request received :', req);
      next(new InvalidRequestError());
    } else next();
  } else {
    logger.warn('Not a X-Hub request received :', req);
    next(new InvalidRequestError());
  }
};

module.exports = security;
