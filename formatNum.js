const padEnd = require('./padEnd');
const isDefined = require('./isDefined');
const {
  base,
} = require('./parseNum');
const RE_TRIM_RIGHT_ZERO = /0+$/gim;


module.exports = (num, fixedMax, separator, space, rightTrim, fixedMin) => {
  const parts = base(num);
  if (!parts) return '' + num;
  // eslint-disable-next-line
  let val = parts[1] || '0', right = parts[2], sign = parts[0];
  if (isNaN(parseFloat(val + '.' + (right || '0')))) {
    return val;
  }
  isDefined(space) || (space = ' ');
  sign && (sign += space);
  let result = '', balance, i = 0, l = val.length; // eslint-disable-line
  isDefined(fixedMax)
    && (right = padEnd(right, fixedMax, '0').substr(0, fixedMax));
  rightTrim && (right = right.replace(RE_TRIM_RIGHT_ZERO, ''));
  isDefined(fixedMin) && (right = padEnd(right, fixedMin, '0'));
  for (; i < l; i++) {
    balance = (l - i) % 3;
    if (!balance && i) result += space;
    result += val[i];
  }
  return sign + (right ? (result + (separator || '.') + right) : result);
};
