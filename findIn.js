/**
 * @overview findIn
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 */

module.exports = (collection, iteratee, ctx) => {
  let v, k; // eslint-disable-line
  for (k in collection) {
    if (iteratee.call(ctx, v = collection[k], k, collection)) return v;
  }
};
