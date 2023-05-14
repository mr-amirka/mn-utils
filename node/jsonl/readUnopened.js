const readUnopened = require('../file/readUnopened');
const TransformFrom = require('./TransformFrom');

/*
const readableStream = readUnopened('./input.jsonl', {
  bufferLength: 1024 * 8,
});
*/

module.exports = (path, options) => {
  return readUnopened(path, options).pipe(new TransformFrom());
};
