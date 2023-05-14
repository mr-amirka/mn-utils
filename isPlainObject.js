const getPrototypeOf = require('./getPrototypeOf');

module.exports = (v) => v && typeof v === 'object'
  && !((v = getPrototypeOf(v)) && getPrototypeOf(v));
