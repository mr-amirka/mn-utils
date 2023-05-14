const promisifyStream = require('../../../CancelablePromise').promisifyStream;
const readUnopened = require('../readUnopened');

module.exports = (path, options, onReadable) => {
  return promisifyStream(readUnopened(path, options), onReadable);
};
