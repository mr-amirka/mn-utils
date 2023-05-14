const isFunction = require('./isFunction');
module.exports = (v) => v && isFunction(v.on) && isFunction(v.getValue);
