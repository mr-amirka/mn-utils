const padEnd = require('./padEnd');

module.exports = (amount, pow) => {
  const parts = ('' + amount).split('.');
  return parts[0].replace(/^0+/, '') + padEnd(parts[1], pow, '0');
};
