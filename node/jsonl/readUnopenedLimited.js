const extend = require('../../extend');
const limitStream = require('../../limitStream');
const readUnopened = require('./readUnopened');


module.exports = (path, options) => {
  options = extend(options);
  const limit = options.limit;
  delete options.limit;
  return limitStream(readUnopened(path, options), limit);
};
