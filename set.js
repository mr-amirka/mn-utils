const isObjectLike = require('./isObjectLike');
const isIndex = require('./isIndex');

function set(ctx, path, value) {
  return path
    ? base(ctx, ('' + path).split('.'), value)
    : ctx;
}
function base(ctx, path, value) {
  const length = path.length;
  const lastIndex = length - 1;
  let nested = ctx, k, nextKey = path[0], i = 0, next; //eslint-disable-line
  while (nested && i < lastIndex) {
    k = nextKey;
    nextKey = path[++i];
    nested = isObjectLike(next = nested[k])
      ? next
      : (nested[k] = isIndex(nextKey) ? [] : {});
  }
  nested[nextKey] = value;
  return ctx;
};
set.base = base;
module.exports = set;
