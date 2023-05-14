const deflags = require('./deflags');
const joinSpace = require('./joinSpace');
module.exports = (src, suffix) => joinSpace(deflags(src))
  + (suffix ? (' ' + suffix) : '');
