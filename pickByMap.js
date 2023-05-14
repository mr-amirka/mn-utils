/**
 * @overview pickByMap
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 */

module.exports = (src, _map, dst) => {
  dst = dst || {};
  let v, k; //eslint-disable-line
  for (k in _map) (v = src[k]) === undefined || (dst[k] = v); //eslint-disable-line
  return dst;
};
