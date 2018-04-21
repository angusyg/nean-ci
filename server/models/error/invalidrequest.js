/**
 * @fileoverview Creates an invalid request error
 * @module models/error/invalidrequest
 * @requires helpers/logger
 */

const ApiError = require('./api');

const ns = 'models:error:invalidrequest';
const { debug } = require('../../helpers/logger')(ns);

/**
 * Creates an InvalidRequestError
 * @class
 * @extends {ApiError}
 */
class InvalidRequestError extends ApiError {
  constructor() {
    super('INVALID_REQUEST', 'Invalid X-Hub Request');

    /**
     * Name of the error
     * @default InvalidRequestError
     * @member {string}
     */
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);

    /**
     * HTTP status code of the response to be send
     * @default 401
     * @member {number}
     */
    this.statusCode = 401;

    debug(`${ns}:new: created '${JSON.stringify(this)}'`);
  }
}

module.exports = InvalidRequestError;
