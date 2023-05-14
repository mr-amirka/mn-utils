/**
 * @overview merge
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 */

const isPlainObject = require('./isPlainObject');
const isObjectLike = require('./isObjectLike');
const isDefined = require('./isDefined');
const extend = require('./extend');

/**
 * Объединяет массив значений в одно значение
 * @param mergingSrc {any} - значение или массив значений, которые нужно смерджить в один
 * @param dst {any} - объект, в который осуществляется мердж или значение по умолчанию
 * Возвращает смердженный объект
 *
 * @return {any}
 *
 * @example:
 * var obj1 = {name: 'Vasya'};
 * var obj2 = {age: 10, height: 170};
 * var dst = merge([ obj1, obj2 ]);
 *
 * или
 *
 * var dst = {};
 * merge([ obj1, obj2 ], dst);
 *
 * Если в коллекции только скалярные значения, то возвращает последнее значимое скалярное значение
 * Если в коллекции есть хотя бы один объект, то возвращает смердженный из элементов коллекции объект
 * Если первый аргумент не является массивом, то он трактуется как единственный элемент коллекции
 */

module.exports = (mergingSrc, dst, asArray) => {
  if (!isObjectLike(mergingSrc)) return isDefined(dst) ? dst : mergingSrc;
  if (!(asArray || mergingSrc
    && (mergingSrc instanceof Array))) return extend(dst || {}, mergingSrc);
  const length = mergingSrc.length;
  let last, v, i = 0, tmp = isObjectLike(dst) ? dst : 0; // eslint-disable-line
  for (; i < length; i++) {
    if (isPlainObject(v = mergingSrc[i])) {
      tmp = extend(tmp || {}, v);
    } else {
      if (isDefined(v)) last = v;
    }
  }
  return tmp || last || dst;
};
