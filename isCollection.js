const isObject = require('./isObject');
const isArrayLike = require('./isArrayLike');
const isPlainObject = require('./isPlainObject');

module.exports = (v) => isPlainObject(v) || isObject(v) && isArrayLike(v);
