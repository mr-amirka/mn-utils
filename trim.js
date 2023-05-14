/**
 * @overview trim
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 */

const regexpTrimSpace = /^\s+|\s+$/g;
module.exports = (v) => (v || '').replace(regexpTrimSpace, '');
