/**
 * @fileoverview Version service to test and create a new version from repository
 * @module services/version
 * @requires {@link external:child_process}
 * @requires {@link external:path}
 * @requires config/app
 * @requires helpers/logger
 * @requires models/error/api
 */

const { spawn } = require('child_process');
const path = require('path');
const config = require('../config/app');
const { logger } = require('../helpers/logger')();
const ApiError = require('../models/error/api');

const service = {};

/**
 * Handles github event (push = tests and creates new release)
 * @function handleEvent
 * @param  {string}   gitEvent              - Github event name
 * @param  {string}   branch                - Github event branch name
 * @param  {string}   author                - Github event author
 * @param  {string}   repoUrl               - Repository URL
 * @param  {string}   repoName              - Repository name
 * @throws {ApiError} RELEASE_NOT_VALIDATED - Error(s) occurred while test phase of release
 * @throws {ApiError} CI_SERVER_EVENT       - Github event was initiated by CI Server (ignore)
 * @throws {ApiError} EVENT_NOT_SUPPORTED   - Github event is not supported (only push)
 * @returns {Promise}
 */
service.handleEvent = (gitEvent, branch, author, repoUrl, repoName) => new Promise((resolve, reject) => {
  const branchRegExp = new RegExp('refs/heads/develop');
  switch (gitEvent) {
    case 'push':
      if (branch.match(branchRegExp) !== null) {
        if (author !== 'ci-server') {
          logger.info('Validating new version');
          const version = spawn('sh', [path.join(config.scriptFolder, 'newversion.sh'), repoUrl, repoName], { cwd: config.buildFolder });
          version.stdout.on('data', data => logger.info(data.toString()));
          version.stderr.on('data', data => logger.error(data.toString()));
          version.on('close', (code) => {
            logger[(code === 0 ? 'info' : 'error')](`ended with code ${code}`);
            if (code === 0) resolve();
            else reject(new ApiError('RELEASE_NOT_VALIDATED', 'Some errors occured during tests or creation of new release'));
          });
        } else reject(new ApiError('CI_SERVER_EVENT', `Ignore event ${gitEvent} beacause it was initiated by ci-server`));
      } else reject(new ApiError('CI_SERVER_EVENT', `Ignore event ${gitEvent} beacause it was initiated by ci-server`));
      break;

    default:
      logger.warn('Event not supported :', gitEvent);
      reject(new ApiError('EVENT_NOT_SUPPORTED', `Event ${gitEvent} is not supported`));
  }
});

module.exports = service;
