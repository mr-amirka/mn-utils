const delayFn = require('./delay');

module.exports = (fn, delay) => {
  let _called;
  function free() {
    _called = 0;
  }
  return function() {
    return _called || (
      _called = 1,
      delayFn(free, delay),
      fn.apply(this, arguments) // eslint-disable-line
    );
  };
};
