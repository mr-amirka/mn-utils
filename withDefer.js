const defer = require('./defer');

module.exports = (fn, ctx, result) => {
	let _hasDebounce, _args; // eslint-disable-line
  function exec() {
    _hasDebounce = 0;
    fn.apply(ctx, _args);
  }
  return function() {
    _args = arguments; // eslint-disable-line
    _hasDebounce || (_hasDebounce = 1, defer(exec));
    return result;
  };
};
