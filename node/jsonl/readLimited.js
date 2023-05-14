const extend = require('../../extend');
const limitStream = require('../../limitStream');
const read = require('./read');


module.exports = (path, options) => {
  options = extend(options);
  const limit = options.limit;
  delete options.limit;
  return limitStream(read(path, options), limit);
};
