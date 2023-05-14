/**
 * @overview filterEach
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 */

module.exports = (collection, iteratee, output, ctx) => {
  let v, i = 0, l = collection && collection.length || 0; // eslint-disable-line
  output = output || [];
  for (; i < l; i++) {
    iteratee.call(ctx, v = collection[i], i, collection) && output.push(v);
  }
  return output;
};
