const noop = require('../noop');
const extend = require('../extend');
const each = require('./searchFiles/each');


module.exports = (options) => {
  const _each = options.each || noop;
  const _exclude = options.exclude || noop;
  return each(options.path, extend(extend({}, options), {
    iteratee: (path) => {
      _exclude(path) || _each('found', path);
    },
  }));
};
