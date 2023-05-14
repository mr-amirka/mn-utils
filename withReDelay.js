/**
 * @overview withReDelay
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 */

const delayFn = require('./delay');
const single = require('./single');

module.exports = (fn, delay, ctx) => single(function() {
  return delayFn(fn, delay, arguments, ctx); // eslint-disable-line
});
