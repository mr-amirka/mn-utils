const repeat = require('./repeat');
const __padEnd = ''.padEnd;
const defaultSpace = ' ';

module.exports = __padEnd
  ? ((v, length, space) => __padEnd.call(
      '' + v, length, space || defaultSpace,
  ))
  : ((v, length, space) => {
    space = space || defaultSpace;
    length -= v.length;
    return length > 0
      ? (v + repeat(space, Math.ceil(length / space.length)).substr(0, length))
      : v;
  });
