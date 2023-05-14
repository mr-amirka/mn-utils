const joinOnly = require('./joinOnly');
const __repeat = ''.repeat;

module.exports = __repeat
  ? ((str, count) => __repeat.call(str, count))
  : ((str, count) => {
    const output = new Array(count);
    while (count > 0) output[--count] = str;
    return joinOnly(output);
  });
