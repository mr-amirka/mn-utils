const extend = require('../extend');
const provider = require('./provider');
const encode = require('./encode');
const decode = require('./decode');


module.exports = (options) => {
  return provider(extend({
    encode,
    decode,
  }, options));
};
