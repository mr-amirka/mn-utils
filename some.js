const isMatch = require('./isMatch');
const isFunction = require('./isFunction');
const find = require('./find');


module.exports = (collection, identity, hasArray) => {
  return find(
      collection,
      identity === undefined
        ? identity
        : (
          isFunction(identity)
            ? identity
            : ((v) => isMatch(v, identity))
        ),
      hasArray,
  );
};
