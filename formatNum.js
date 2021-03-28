const padEnd = require('./padEnd');
const reZero =/\.?0+$/g;

module.exports = (v, fixed, dot, space) => {
  let val;
  if (isNaN(val = parseFloat(v || 0)) || !isFinite(val)) return v;
  space === undefined && (space = ' ');
  fixed === undefined && (fixed = 0);
  const parts = ('' + v).split('.');
  let right = (parts[1] || '0').replace(reZero, '');
  fixed === undefined || (right = padEnd(right, fixed, '0'));
  right = right.substr(0, fixed);
  val = parts[0] || '0';
  let result = '', balance, i = 0, l = val.length; // eslint-disable-line
  for (; i < l; i++) {
    balance = (l - i) % 3;
    if (!balance && i) result += space;
    result += val[i];
  }
  return right ? (result + (dot ? dot : '.') + right) : result;
};
