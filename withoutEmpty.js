const isArray = require('./isArray');

function withoutEmpty(data, depth) {
  return base(data, depth || 0);
}
function base(src, depth) {
  if (depth < 0) return src;
  depth--;
  const type = typeof(src);
  let dst = null, v, k; // eslint-disable-line
  if (src === null || src === undefined || (type === 'string' && !src)) {
    return null;
  }
  if (type != 'object') return src;
  if (isArray(src)) return src.length ? src : null;
  for (k in src) { // eslint-disable-line
    ((v = base(src[k], depth)) === null) || ((dst || (dst = {}))[k] = v);
  }
  return dst;
}

withoutEmpty.base = base;
module.exports = withoutEmpty;
