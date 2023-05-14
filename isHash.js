const isString = require('./isString');

const regexp = /^[0-9a-f]+$/;
module.exports = (v, length) => isString(v)
  && v.length === (length || 32) && regexp.test(v);
