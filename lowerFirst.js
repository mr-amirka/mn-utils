
const toLower = require('./toLower');
module.exports = (v) => toLower(v.substr(0, 1)) + v.substr(1);
