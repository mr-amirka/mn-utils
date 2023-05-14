/**
 * @overview flagsSet
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 *
 * @example
 * flagsSet([ 'apple', 'ban', 'test.use' ]); // =>
 * {
 *   apple: 1,
 *   ban: 1,
 *   test: {
 *     use: 1
 *   }
 * }
 *
 */
const set = require('./set');
const reduce = require('./reduce');
module.exports = (flags, dst) => reduce(flags, reducer, dst || {});
const reducer = (dst, key) => {
  set(dst, key, 1);
  return dst;
};
