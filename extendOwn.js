const hasOwn = require('./hasOwn');

module.exports = (dst, src, k) => {
  // eslint-disable-next-line
  for (k in src) hasOwn(src, k) && (dst[k] = src[k]);
  return dst;
};
