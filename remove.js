/**
 * @overview remove
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 */

const isObject = require('./isObject');
function remove(ctx, path) {
  return path ? base(ctx, path.split('.')) : ctx;
}
function base(ctx, path) {
  const length = path.length;
  const lastIndex = length - 1;
  let nested = ctx, k, nextKey = path[0], i = 0, next; // eslint-disable-line
  while (nested && i < lastIndex) {
    k = nextKey;
    nextKey = path[++i];
    if (!isObject(next = nested[k])) return ctx;
    nested = next;
  }
  delete nested[nextKey];
  return ctx;
}

remove.base = base;
module.exports = remove;
