const isString = require('./isString');
module.exports = (v, length) => !isString(v) || v.length < length;
