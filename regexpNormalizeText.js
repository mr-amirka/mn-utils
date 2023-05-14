/**
 * @overview regexpNormalize
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 */

const isRegExp = require('./isRegExp');
const escapeRegExp = require('./escapeRegExp');
const regexpParse = require('./regexpParse');

module.exports = (v) => {
  return isRegExp(v)
    ? regexpParse(v.toString())[1]
    : escapeRegExp(v);
};
