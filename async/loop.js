const CancelablePromise = require('../CancelablePromise');
const {
  resolve: cancelablePromiseResolve,
} = CancelablePromise;

module.exports = (checkFn, statementFn) => {
  let _cancel;
  return new CancelablePromise((resolve, reject) => {
    function next() {
      try {
        checkFn()
          ? (_cancel = cancelablePromiseResolve(statementFn())
              .then(next, reject).cancel)
          : resolve();
      } catch (ex) {
        reject(ex);
      }
    }
    next();
    return () => {
      _cancel && _cancel();
    };
  });
};
