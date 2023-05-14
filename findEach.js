/**
 * @overview findEach
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 */


module.exports = (collection, iteratee, ctx) => {
  let v, i = 0, l = collection && collection.length || 0; // eslint-disable-line
  for (; i < l; i++) {
    if (iteratee.call(ctx, v = collection[i], i, collection)) return v;
  }
};
