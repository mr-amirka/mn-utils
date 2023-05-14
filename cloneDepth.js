const isArray = require('./isArray');
const isObject = require('./isObject');

module.exports = cloneDepth;
cloneDepth.base = base;
function cloneDepth(src, depth) {
  return base(src, depth || 0);
}
function base(src, depth) {
  if (depth < 0) return src;
  depth--;
  let k, dst; // eslint-disable-line
  if (isObject(src)) {
    if (isArray(src)) {
      for (dst = new Array(k = src.length); k--;) dst[k] = base(src[k], depth);
      return dst;
    }
    dst = {};
    for (k in src) dst[k] = base(src[k], depth); // eslint-disable-line
    return dst;
  }
  return src;
};
