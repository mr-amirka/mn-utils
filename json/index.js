/**
 * @overview JSON
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 */

module.exports = require('../support')('JSON') || {
  stringify: require('./stringify'),
  parse: require('./parse'),
};
