const regexpNormalizeText = require('./regexpNormalizeText');
const unslash = require('./unslash');
const map = require('./map');

module.exports = (separator, escaped) => {
  separator = regexpNormalizeText(separator);
  escaped = escaped ? regexpNormalizeText(escaped) : '\\\\.';
  const regexp = new RegExp('(' + escaped + ')|(' + separator + '(.*)$)', 'g');
  function instance(input) {
    return map(base(input), unslash);
  }
  function base(input) {
    let prefix = input, value = '', suffix = ''; // eslint-disable-line
    input.replace(regexp, (all, escaped, _suffix, _value, offset) => {
      escaped || (
        suffix = _suffix,
        value = _value,
        prefix = input.substr(0, offset)
      );
    });
    return [prefix, suffix, value];
  }
  instance.base = base;
  return instance;
};
