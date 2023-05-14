const slice = require('./slice');
const __push = [].push;

module.exports = function(self) {
  __push.apply(self, slice(arguments, 1)); // eslint-disable-line
  return self;
};
