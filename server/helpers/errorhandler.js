/**
 * @fileoverview Middlewares for error handling
 * @module helpers/errorhandler
 * @requires models/error/api
 * @requires models/error/notfound
 */

const ApiError = require('../models/error/api');
const NotFoundError = require('../models/error/notfound');

const errorhandler = {};
/**
 * Catch all non mapped request for error
 * @function errorNoRouteMapped
 * @param  {external:Error}          req  - Request received
 * @param  {external:Response}       res  - Response to be send
 * @param  {nextMiddleware} next - Callback to pass control to next middleware
 */
errorhandler.errorNoRouteMapped = (req, res, next) => next(new NotFoundError());

/**
 * Default Error handler
 * @function errorHandler
 * @param  {external:Error}          err  - Unhandled error to process
 * @param  {external:Request}        req  - Request received
 * @param  {external:Response}       res  - Response to be send
 * @param  {nextMiddleware} next - Callback to pass control to next middleware
 */
errorhandler.errorHandler = (err, req, res, next) => {
  if (res.headersSent) next(err);
  else ApiError.handle(req, res, err);
};

module.exports = errorhandler;
