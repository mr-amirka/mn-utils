/**
 * @overview flags
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 *
 * @example
 * flags([ 'apple', 'ban' ]); // =>
 * {
 *   apple: 1,
 *   ban: 1,
 * }
 *
 */
const reduce = require('./reduce');
module.exports = (flags, dst) => reduce(flags, (dst, key) => {
  dst[key] = 1;
  return dst;
}, dst || {});
