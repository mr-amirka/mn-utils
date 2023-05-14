const once = require('./once');

module.exports = (promise, onResolve, onReject, onCancel) => {
  if (promise.cancel) {
    promise = promise.then(onResolve, onReject, onCancel);
    return promise.cancel.bind(promise);
  }
  promise = promise.then(
      (value) => {
        onResolve && onResolve(value);
      },
      (error) => {
        onReject && onReject(error);
      },
  );

  return once(() => {
    const _onCancel = onCancel;
    promise = onResolve = onReject = onCancel = 0;
    _onCancel && _onCancel();
  });
};
