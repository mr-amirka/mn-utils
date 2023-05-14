const reduce = require('./reduce');

module.exports = (self, methods) => {
  return reduce(methods, iterateeBindMethods, self);
};

function iterateeBindMethods(self, method) {
  return self[method] = self[method].bind(self);
  return self;
}
