const noop = require('../noop');
const {
  resolve: cancelablePromiseResolve,
  runWithDelay,
} = require('../CancelablePromise');


module.exports = (fn, delay, ctx) => {
  let _promise = cancelablePromiseResolve();
  return function() {
    const args = arguments; // eslint-disable-line

    return _promise = _promise.catch(noop).then(() => {
      return runWithDelay(fn, delay, ctx, args);
    });
  };
};
