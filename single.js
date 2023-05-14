const isPromise = require('./isPromise');
const isFunction = require('./isFunction');

module.exports = (fn, ctx) => {
  let _cancel;
  function instance() {
    cancel();
    return _cancel = fn.apply(ctx, arguments); // eslint-disable-line
  }
  function cancel() {
    const __cancel = _cancel;
    _cancel = 0;
    __cancel && (
      isFunction(__cancel)
        ? __cancel()
        : isPromise(__cancel)
          && isFunction(__cancel.cancel)
          && __cancel.cancel()
    );
  }
  instance.cancel = cancel;
  return instance;
};
