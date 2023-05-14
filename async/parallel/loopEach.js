const CancelablePromise = require('../../CancelablePromise');
const forEachParallel = require('./forEach');


module.exports = (input, iteratee, ctx, taskLimit) => {
  return new CancelablePromise(() => {
    let _promise;
    function base() {
      _promise = forEachParallel(input, iteratee, ctx, taskLimit)
          .then(base);
    }
    base();
    return () => {
      _promise.cancel();
    };
  });
}