const CancelablePromise = require('../CancelablePromise');
const {
  resolve: cancelablePromiseResolve,
  runWithDelay,
} = CancelablePromise;


module.exports = (fn, delay, ctx) => {
	let _hasDebounce, _args, _promise = cancelablePromiseResolve(); // eslint-disable-line
  function exec() {
    _hasDebounce = 0;
    return fn.apply(ctx, _args);
  }
  return function() {
    _args = arguments; // eslint-disable-line
    _hasDebounce || (_hasDebounce = 1, _promise = runWithDelay(exec, delay));
    return _promise;
  };
};
