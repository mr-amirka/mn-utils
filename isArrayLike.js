const isLength = require('./isLength');
module.exports = (v) => v && isLength(v.length);
