const isDefined = require('./isDefined');
const __slice = [].slice;


module.exports = __slice ? function(self) {
  return __slice.apply(self, __slice.call(arguments, 1)); // eslint-disable-line
} : ((input, start, end) => {
  let length = input && input.length || 0;
  start = Math.max(start || 0, 0);
  end = isDefined(end) ? Math.min(length, end) : length;
  const output = new Array(length = Math.max(0, end - start));
  let i = 0;
  for (; i < length; i++) output[i] = input[i + start];
  return output;
});
