/**
 * @overview uniqWith
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 */

const isMatch = require('./isMatch');

module.exports = (input, comparator, output) => {
  output = output || [];
  comparator = comparator || isMatch;
  if (!input) return output;
  let i = 0, l = input.length || 0, ii, il = 0, includes = [], hasUniq, value; // eslint-disable-line
  for (;i < l; i++) {
    value = input[i];
    for (hasUniq = 1, ii = 0; ii < il; ii++) {
      if (comparator(includes[ii], value)) {
        hasUniq = 0;
        break;
      }
    }
    hasUniq && (
      includes.push(value),
      il++,
      output.push(value)
    );
  }
  return output;
};
