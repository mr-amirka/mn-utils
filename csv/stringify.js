const isObject = require('./isObject');
const map = require('./map');
const escapeRegExp = require('./escapeRegExp');

const regexpSpace = /^\s+|\s+$/;

module.exports = (data, delimeter) => {
  delimeter = delimeter || ';';
  const regexpSpecial
    = new RegExp('([,;"\\\\' + escapeRegExp(delimeter) + '])', 'g');

  function iteratee(v) {
    return regexpSpace.test(v = ('' + v).replace(regexpSpecial, '\\$1'))
      ? ('"' + v + '"')
      : v;
  }
  return isObject(data) ? map(data, (line) => {
    return isObject(line)
      ? map(line, iteratee, []).join(delimeter)
      : ('' + line);
  }, []).join('\n') : '';
};
