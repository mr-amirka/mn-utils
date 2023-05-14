const repeat = require('./repeat');
const __padStart = ''.padStart;
const defaultSpace = ' ';

module.exports = __padStart
  ? ((v, length, space) => __padStart.call(
      '' + v, length, space || defaultSpace,
  ))
  : ((v, length, space) => {
    space = space || defaultSpace;
    length -= v.length;
    return length > 0
      ? (repeat(space, Math.ceil(length / space.length)).substr(0, length) + v)
      : v;
  });
