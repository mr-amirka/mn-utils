/**
 * @overview findIndexLast
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 */
const iterateeNormalize = require('./iterateeNormalize');


module.exports = (collection, iteratee, ctx) => {
  const length = collection && collection.length || 0;
  if (!length) return -1;
  iteratee = iterateeNormalize(iteratee);
  let i = 0; // eslint-disable-line
  for (; i < length; i++) {
    if (iteratee.call(ctx, collection[i], i, collection)) return i;
  }
  return -1;
};
