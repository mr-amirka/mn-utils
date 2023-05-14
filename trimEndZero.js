const padEnd = require('./padEnd');
const reZero =/\.?0+$/g;

module.exports = (v, padLength) => {
  const parts = ('' + v).split('.');
  const left = parts[0] || '0';
  let right = (parts[1] || '').replace(reZero, '');
  padLength === undefined || (right = padEnd(right, padLength, '0'));
  return right ? (left + '.' + right) : left;
};
