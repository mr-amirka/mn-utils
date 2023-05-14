const isArray = require('./isArray');
const isPlainObject = require('./isPlainObject');


module.exports = (v) => isArray(v) || isPlainObject(v);
