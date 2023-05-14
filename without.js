const indexOf = require('./indexOf');

module.exports = (src, without, dst) => {
  dst = dst || {};
  let key;
  for (key in src) indexOf(without, key) < 0 && (dst[key] = src[key]); //eslint-disable-line
  return dst;
};
