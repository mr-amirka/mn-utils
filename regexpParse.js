/**
 * @overview regexpParse
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 */

const regexp = /^\/(.*)\/(\w*)$/;
module.exports = (v) => regexp.exec(v);
