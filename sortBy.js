/**
 * @overview sortBy
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 */

const iterateeNormalize = require('./iterateeNormalize');
const __sort = [].sort;

module.exports = (src, iteratee) => {
  const _iteratee = iterateeNormalize(iteratee);
  return __sort.call(src, (a, b) => {
    a = _iteratee(a);
    b = _iteratee(b);
    return a < b ? -1 : (
      a > b ? 1 : 0
    );
  });
};
