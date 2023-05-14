const noop = require('../noop');
const {
  resolve: cancelablePromiseResolve,
} = require('../CancelablePromise');


module.exports = (fn, ctx) => {
  let _promise = cancelablePromiseResolve();
  return function() {
    const args = arguments; // eslint-disable-line

    return _promise = _promise.catch(noop).then(() => {
      return fn.apply(ctx, args || []);
    });
  };
};
