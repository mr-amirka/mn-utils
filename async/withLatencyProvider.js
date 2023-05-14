const noop = require('../noop');
const CancelablePromise = require('../CancelablePromise');

const {
	delay: cancelablePromiseDelay,
	all: cancelablePromiseAll,
	resolve: cancelablePromiseResolve,
  run: cancelablePromiseRun,
} = CancelablePromise;


module.exports = (requestLatency) => {
	let _promise = cancelablePromiseResolve();

  return (fn, args, ctx) => {
    return _promise = _promise.catch(noop).then(() => {
      let _errorBox;
      return cancelablePromiseAll([
        cancelablePromiseRun(fn, args, ctx).catch((error) => {
          _errorBox = {
            error,
          };
        }),
        cancelablePromiseDelay(requestLatency),
      ]).then((responses) => {
        if (_errorBox) {
          throw _errorBox.error;
        }
        return responses[0];
      });
    })
  }
};

