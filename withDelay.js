const delayFn = require('./delay');

module.exports = (fn, delay, ctx, result) => {
	let _hasDebounce, _args; // eslint-disable-line
  function exec() {
    _hasDebounce = 0;
    fn.apply(ctx, _args);
  }
  return function() {
    _args = arguments; // eslint-disable-line
    _hasDebounce || (_hasDebounce = 1, delayFn(exec, delay));
    return result;
  };
};
