/**
 * @overview isLength
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 */

const MAX_SAFE_INTEGER = 9007199254740991;
module.exports = (v) => typeof v == 'number' && v > -1 && v % 1 == 0
  && v <= MAX_SAFE_INTEGER;
