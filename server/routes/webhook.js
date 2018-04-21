/**
 * @fileoverview App webhook router
 * @module routes/webhook
 * @requires {@link external:express}
 * @requires helpers/security
 * @requires controllers/webhook
 */

const express = require('express');
const security = require('../helpers/security');
const versionController = require('../controllers/webhook');

const router = express.Router();

/**
 * @path {POST} /
 * @body {json}     result
 * @body {string}   result.message  - event status
 * @header {string} x-github-event  - Github webhook Event
 * @header {string} X-Hub           - XHUB value
 * @code {200} if successful, no content
 * @code {500} if an error occurred (bad xhub header, bad event ...)
 * @name webhook
 */
router.post('/', security.checkXHub, versionController.handleRequest);

module.exports = router;
