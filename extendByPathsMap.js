const extend = require('./extend');
const isPlainObject = require('./isPlainObject');
const isObject = require('./isObject');
const get = require('./get');
const set = require('./set');

module.exports = (dst, src, map) => {
  if (!map) return dst;
  if (!isObject(map)) return get(src, map);
  let to, from, v; // eslint-disable-line
  for (to in map) { // eslint-disable-line
    from = map[to];
    ((v = from === '' ? src : get(src, from)) === undefined)
      || (to ? set(dst, to, v) : (isPlainObject(v) && extend(dst, v)));
  }
  return dst;
};
