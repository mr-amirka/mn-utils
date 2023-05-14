const isFunction = require('./isFunction');
const wrapper = require('./wrapper');


module.exports = (length, fn, output, i) => {
  fn = isFunction(fn) ? fn : wrapper(fn);
  for (output = output || new Array(length), i = i || 0; i < length; i++) {
    output[i] = fn(i);
  }
  return output;
};
