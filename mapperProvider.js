/**
 * @overview mapperProvider
 * @example
 * const mapper = mapperProvider([ 'name', 'age']);
 * mapper([ 'Вася', 30 ]) //=> {name: 'Вася', age: 30}
 *
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 */

const set = require('./set');
module.exports = (keys) => {
  keys || (keys = []);
  const l = keys.length;
  return (values, dst) => {
    dst || (dst = {});
    if (!values) return dst;
    for (let i = 0, v; i < l; i++) {
      (v = values[i]) === undefined || set(dst, keys[i], v);
    }
    return dst;
  };
};
