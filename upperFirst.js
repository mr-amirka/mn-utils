/**
 * @overview upperFirst
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 */

const toUpper = require('./toUpper');
module.exports = (v) => toUpper(v.substr(0, 1)) + v.substr(1);
