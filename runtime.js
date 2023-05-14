const support = require('./support');
const time = require('./time');

module.exports = support('performance.now')
  ? (() => performance.now())
  : ((start) => {
    return () => time() - start;
  })(time());
