const isArray = require('./isArray');
const isFunction = require('./isFunction');
const noopHandle = require('./noopHandle');
const getterProvider = require('./get').getter;

module.exports = (collection, iteratee, dst) => {
  if (!collection) return dst || {};
  isFunction(iteratee) || (iteratee = getterProvider(iteratee) || noopHandle);
  let hasArray = isArray(dst), k = 0, l; // eslint-disable-line
  if (hasArray || isArray(collection)) {
    l = collection && collection.length || 0;
    dst = dst || new Array(l);
    for (; k < l; k++) dst[k] = iteratee(collection[k], k);
  } else {
    dst = dst || {};
    for (k in collection) dst[k] = iteratee(collection[k], k); // eslint-disable-line
  }
  return dst;
};
