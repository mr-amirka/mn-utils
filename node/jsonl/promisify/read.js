const promisifyStream = require('../../../CancelablePromise').promisifyStream;
const read = require('../read');

module.exports = (path, options, onReadable) => {
  return promisifyStream(read(path, options), onReadable);
};
