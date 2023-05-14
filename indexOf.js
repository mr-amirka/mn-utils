/**
 * @overview indexOf
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 */

const __indexOf = [].indexOf;
module.exports = __indexOf
  ? ((collection, v) => __indexOf.call(collection, v))
  : ((collection, v) => {
    let l = collection && collection.length || 0, i = 0; // eslint-disable-line
    for (; i < l; i++) {
      if (collection[i] === v) return i;
    }
    return -1;
  });
