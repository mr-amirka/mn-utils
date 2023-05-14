const isPlainObject = require('./isPlainObject');
const isObject = require('./isObject');

function extendDepth(dst, src, depth) {
  if (src === undefined) return dst;
  depth || (depth = 0);
  if (depth < 0 || !isPlainObject(src)) return src;
  base(isObject(dst) ? dst : (dst = {}), src, depth);
  return dst;
}
function base(dst, src, depth) {
  depth--;
  let k, to, from, dp = depth > -1; // eslint-disable-line
  for (k in src) {
    if ((from = src[k]) === undefined) continue;
    if (dp && isPlainObject(from)) {
      base(isObject(to = dst[k]) ? to : (dst[k] = {}), from, depth);
      continue;
    }
    dst[k] = from;
  }
}
extendDepth.base = base;
module.exports = extendDepth;
