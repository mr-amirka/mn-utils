const isObject = require('./isObject');
const isArray = require('./isArray');
const isEmpty = require('./isEmpty');

module.exports = (m, k) => {
  return !m && m !== 0 ? 1 : (
    isObject(m) ? (isArray(m) ? m.length < 1 : isEmpty(m)) : 0
  );
};
