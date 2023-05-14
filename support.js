/**
 * @overview support
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 */

const cache = {};
module.exports = function(expression) {
  try {
    return (cache[expression] || (cache[expression] = new Function('return ' + expression)))();
  } catch(ex) {}
  return null;
};
