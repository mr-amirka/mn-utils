/**
 * @overview jsonParse
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 */

module.exports = require('../support')('JSON.parse') || ((v) => {
  return (new Function('return ' + v)).call(null);
});
