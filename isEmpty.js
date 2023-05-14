module.exports = (src, k) => {
  for (k in src) return 0; // eslint-disable-line
  return 1;
};
