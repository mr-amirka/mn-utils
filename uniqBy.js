/**
 * @overview uniqBy
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 */

const isFunction = require('./isFunction');
const noopHandle = require('./noopHandle');
const getterProvider = require('./get').getter;
const uniqBase = require('./uniqBase');

module.exports = (input, iteratee, output) => {
  return uniqBase(
      input,
      isFunction(iteratee) ? iteratee : getterProvider(iteratee) || noopHandle,
      output,
  );
};
