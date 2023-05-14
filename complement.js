const isPlainObject = require('./isPlainObject');
const isObject = require('./isObject');

function complement(dst, src, depth) {
  depth || (depth = 0);
  if (depth < 0 || !isPlainObject(src)) return dst === undefined ? src : dst;
  if (!isObject(dst)) {
    if (dst !== undefined) return dst;
    dst = {};
  }
  return base(dst, src, depth);
}
function base(dst, src, depth) {
  depth--;
  let k, to, from, dp = depth > -1; // eslint-disable-line
  for (k in src) {
    if ((from = src[k]) === undefined) continue;
    if ((to = dst[k]) === undefined) {
      dp && isPlainObject(from)
        ? base(dst[k] = {}, from, depth)
        : (dst[k] = from);
      continue;
    }
    dp && isObject(to) && isPlainObject(from) && base(to, from, depth);
  }
  return dst;
}

complement.base = base;
module.exports = complement;
