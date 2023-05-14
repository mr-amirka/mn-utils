const isRegExp = require('./isRegExp');
const escapeRegExp = require('./escapeRegExp');

module.exports = (pattern, mode) => {
  const p = isRegExp(pattern)
    ? pattern.toString().replace(regexpRegexpTrim, '')
    : escapeRegExp(pattern);
  const regexp = new RegExp((handles[mode] || defaultHandle)(p), 'g');
  return (v) => (v || '').replace(regexp, '');
};
const regexpRegexpTrim = /^\/|\/[^\/]*$/g;
const handles = {
  left: (v) => '^(' + v + ')+',
  right: (v) => '(' + v + ')+$',
};
const defaultHandle = (v) => '^(' + v + ')+|(' + v + ')+$';
