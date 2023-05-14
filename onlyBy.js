/**
 * @overview onlyBy
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 */

const iterateeNormalize = require('./iterateeNormalize');
const isFunction = require('./isFunction');

module.exports = (collection, iteratee, compare, hasArray) => {
  const _iteratee = iterateeNormalize(iteratee);
  const _compare = normalize(compare);
  let value, item, tmpItem, tmpValue;
  if (hasArray || collection && (collection instanceof Array)) {
    const length = collection.length;
    for (let i = 0; i < length; i++) {
      tmpValue = _iteratee(tmpItem = collection[i], i);
      if (!item || _compare(tmpValue, value)) {
        item = tmpItem;
        value = tmpValue
      }
    }
  } else {
    for (let k in collection) {
      tmpValue = _iteratee(collection[k], k);
      if (!item || _compare(tmpValue, value)) {
        item = tmpItem;
        value = tmpValue
      }
    }
  }
  return item;
};

const normalize = compare => isFunction(compare) ? compare : (compare ? byMax : byMin);
const byMax = (v, w) => v > w;
const byMin = (v, w) => v < w;
