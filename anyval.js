const isBoolean = require('./isBoolean');
const isNumber = require('./isNumber');
const isDefined = require('./isDefined');
function normalize(value, minVal, maxVal) {
  if (isDefined(minVal)) {
    if (isNumber(minVal)) {
      value = Math.max(value, minVal);
    } else {
      throw new TypeError('min value should be number: ' + minVal);
    }
  }
  if (isDefined(maxVal)) {
    if (isNumber(maxVal)) {
      value = Math.min(value, maxVal);
    } else {
      throw new TypeError('max value should be number: ' + maxVal);
    }
  }
  return value;
}
function anyValProvider(parse) {
  return (value, def, minVal, maxVal) => {
    return isBoolean(value)
        ? normalize(value ? 1 : 0, minVal, maxVal)
        : (
          isNaN(value = parse(value))
              ? (def || 0)
              : normalize(value, minVal, maxVal)
          );
  };
}
module.exports = {
  intval: anyValProvider(parseInt),
  floatval: anyValProvider(parseFloat),
};
