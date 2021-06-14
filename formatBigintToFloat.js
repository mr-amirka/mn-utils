const padStart = require('mn-utils/padStart');

module.exports = (amount, decimals) => {
  amount = '' + amount;
  if (amount.indexOf('.') > -1) return amount;
  decimals = decimals || 0;
  const length = amount.length;
  const start = length - decimals;
  return length > decimals
    ? (amount.substr(0, start) + '.' + amount.substr(start))
    : ('0.' + padStart(amount, decimals, '0'));
};
