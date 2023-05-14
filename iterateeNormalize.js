/**
 * @overview iterateeNormalize
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 */

const noopHandle = require('./noopHandle');
const isDefined = require('./isDefined');
const isArray = require('./isArray');
const get = require('./get');
const getBase = get.base;
const getterProvider = get.getter;

function checkerProvider([path, value]) {
  path = isArray(path) ? path : ('' + path).split('.');
  return (v) => getBase(v, path) === value;
}

module.exports = (iteratee) => {
  return isDefined(iteratee)
    ? (isArray(iteratee) ? checkerProvider(iteratee) : getterProvider(iteratee))
    : noopHandle;
};
