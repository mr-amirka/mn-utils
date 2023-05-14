const support = require('./support');
const regexpEscape = /([[\]#.*^$()><+~=|:;,"'`\s@%\\\!\/])/g;
module.exports = support('CSS.escape')
  || ((v) => v.replace(regexpEscape, '\\$1'));
