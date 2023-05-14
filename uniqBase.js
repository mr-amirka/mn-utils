/**
 * @overview uniqBase
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 */

const indexOf = require('./indexOf');

module.exports = (input, iteratee, output) => {
  output = output || [];
  if (!input) return output;
  let i = 0, l = input.length || 0, includes = [], value, computed; // eslint-disable-line
  for (; i < l; i++) {
    if (indexOf(includes, computed = iteratee(value = input[i])) > -1) continue;
    includes.push(computed);
    output.push(value);
  }
  return output;
};
