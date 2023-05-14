const flags = require('./flags');
const splitSpace = require('./splitSpace');
module.exports = (v, dst) => flags(splitSpace(v || ''), dst);
