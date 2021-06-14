const regexpNormalizeText = require('./regexpNormalizeText');
const unslash = require('./unslash');
const push = require('./push');
const map = require('./map');
const joinOnly = require('./joinOnly');

module.exports = (separator, escaped) => {
  separator = regexpNormalizeText(separator);
  escaped = escaped ? regexpNormalizeText(escaped) : '\\\\.';
  const regexp = new RegExp('(' + escaped + ')|(' + separator + ')', 'g');
  function escapedSplit(input, dstSeparators) {
    return map(base(input, dstSeparators), unslash);
  }
  function base(input, dstSeparators) {
    let lastOffset = 0, v = [], output = []; // eslint-disable-line
    input.replace(regexp, function(all, escaped, separator) {
      let args = arguments, offset = args[args.length - 2]; // eslint-disable-line
      push(v, input.substr(lastOffset, offset - lastOffset));
      escaped
        ? push(v, escaped)
        : (
          dstSeparators && push(dstSeparators, separator),
          push(output, joinOnly(v)),
          v = []
        );
      lastOffset = offset + all.length;
    });
    push(v, input.substr(lastOffset));
    return push(output, joinOnly(v));
  }
  escapedSplit.base = base;
  return escapedSplit;
};
