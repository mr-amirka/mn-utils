const __push = [].push;

module.exports = (dst, src) => {
  __push.apply(dst, src);
  return dst;
};
