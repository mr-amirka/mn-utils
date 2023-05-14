module.exports = require('./provider')({
  defer: require('../defer'),
  ParentClass: require('../support')('Promise'),
});
