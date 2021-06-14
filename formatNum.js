const half = require('./half');
const padEnd = require('./padEnd');

module.exports = (val, fixed, separator, space) => {
  space === undefined && (space = ' ');
  const parts = half('' + val, '.');
  val = parts[0];
  let result = '', balance, i = 0, l = val.length, right = parts[1] || ''; // eslint-disable-line
  fixed === undefined || (right = padEnd(right, fixed, '0').substr(0, fixed));
  for (; i < l; i++) {
    balance = (l - i) % 3;
    if (!balance && i) result += space;
    result += val[i];
  }
  return right ? (result + (separator || '.') + right) : result;
};
