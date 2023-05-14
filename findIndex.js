/**
 * @overview findIndex
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 */

const iterateeNormalize = require('./iterateeNormalize');
const isArray = require('./isArray');

module.exports = (collection, iteratee, ctx, hasArray) => {
  if (!collection) return -1;
  iteratee = iterateeNormalize(iteratee);
  let k = 0, l; // eslint-disable-line
  if (hasArray || isArray(collection)) {
    for (l = collection.length || 0; k < l; k++) {
      if (iteratee.call(ctx, collection[k], k, collection)) return k;
    }
  } else {
    for (k in collection) {
      if (iteratee.call(ctx, collection[k], k, collection)) return k;
    }
  }
  return -1;
};
