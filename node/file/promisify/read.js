module.exports = require('../../../CancelablePromise')
    .promisify(require('fs').readFile);
