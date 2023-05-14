const MAX_SAFE_NUMBER = 2147483647;
module.exports = (v) => {
  return !isNaN(v = parseFloat(v)) && v >= 0 && v < MAX_SAFE_NUMBER;
};
