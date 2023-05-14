/**
 * @overview uniq
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 */

const noopHandle = require('./noopHandle');
const uniqBase = require('./uniqBase');

module.exports = (input) => uniqBase(input, noopHandle);
