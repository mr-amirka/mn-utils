/**
 * @overview mergeDepth
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 */

const isArray = require('./isArray');
const isPlainObject = require('./isPlainObject');
const isObjectLike = require('./isObjectLike');
const isDefined = require('./isDefined');
const complement = require('./complement');

/**
 * @description
 * Объединяет массив значений в одно значение до заданной глубины
 * @param mergingCollection {array[any]|any} - значение или массив значений, которые нужно смерджить в одно
 * @param dst {any} - объект, в который осуществляется мердж или значение по умолчанию
 * @param depth {number|undefined} - глубина мерджа для вложенных объектов
 * Возвращает смердженный объект
 *
 * @return {any}
 *
 * @example:
 * var obj1 = {name: 'Vasya'};
 * var obj2 = {age: 10, height: 170};
 * var dst = mergeDepth([ obj1, obj2 ]);
 *
 * или
 *
 * var dst = {};
 * mergeDepth([ obj1, obj2 ], dst);
 */
module.exports = (mergingCollection, dst, depth) => {
  depth || (depth = 10);
  if (depth < 0) return dst;
  if (!isObjectLike(mergingCollection)) {
    return isDefined(dst) ? dst : mergingCollection;
  }
  if (!isArray(mergingCollection)) {
    return complement(dst, mergingCollection, depth);
  }
  let v, i = mergingCollection.length, last, tmp = isObjectLike(dst) ? dst : undefined; // eslint-disable-line
  for (; i--;) {
    if (isPlainObject(v = mergingCollection[i])) {
      tmp = complement(tmp || {}, v, depth);
    } else {
      if (isDefined(v)) last = v;
    }
  }
  return tmp || last || dst;
};
