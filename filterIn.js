/**
 * @overview filterIn
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 */

module.exports = (collection, iteratee, output, ctx) => {
  let v, k; // eslint-disable-line
  output = output || {};
  for (k in collection) { // eslint-disable-line
    iteratee.call(ctx, v = collection[k], k, collection) && (output[k] = v);
  }
  return output;
};
