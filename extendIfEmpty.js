module.exports = (dst, src, k) => {
  for (k in src) dst[k] || (dst[k] = src[k]); // eslint-disable-line
  return dst;
};
