/**
 * @fileoverview Url not found error class module to create and convert error to json response
 * @module models/error/notfound
 * @requires helpers/logger
 */

const ApiError = require('./api');

const ns = 'models:error:notfound';
const { debug } = require('../../helpers/logger')(ns);

/**
 * Url not found error class module to create and convert error to json response
 * @class
 * @extends {ApiError}
 */
class NotFoundError extends ApiError {
  constructor() {
    super('NOT_FOUND', 'No endpoint mapped for requested url');

    /**
     * Name of the error
     * @default NotFoundError
     * @member {string}
     */
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);

    /**
     * HTTP status code of the response to be send
     * @default 404
     * @member {number}
     */
    this.statusCode = 404;

    debug(`${ns}:new: created '${JSON.stringify(this)}'`);
  }
}

module.exports = NotFoundError;
