/**
 * @overview isPromise
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 *
 */

const isFunction = require('./isFunction');
module.exports = (v) => v && isFunction(v.then);
