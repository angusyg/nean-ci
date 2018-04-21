/**
 * @fileoverview App Webhook controller
 * @module controllers/webhook
 * @requires services/version
 */

const versionService = require('../services/version');

const controller = {};

/**
 * Handles incoming webhook request
 * @function handleRequest
 * @param  {external:Request}   req  - Request received
 * @param  {external:Response}  res  - Response to be send
 * @param  {nextMiddleware}     next - Callback to pass control to next middleware
 */
controller.handleRequest = (req, res, next) => {
  versionService.handleEvent(req.headers['x-github-event'], req.body.ref, req.body.head_commit.author.name, req.body.repository.url, req.body.repository.name)
    .then(() => res.status(200).json({ message: 'Event handled' }))
    .catch(err => next(err));
};

module.exports = controller;
