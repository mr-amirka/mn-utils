const delay = require('../delay');
const isPromise = require('../isPromise');
const cancelableThen = require('../cancelableThen');

module.exports = (fn, _delay, args, self) => {
  self = self || null;
  args = args || [];
  let _cancel;
  nextLazy();
  function next(promise) {
    try {
      isPromise(promise = fn.apply(self, args))
        ? (_cancel = cancelableThen(promise, nextLazy, nextLazy))
        : nextLazy();
    } catch (ex) {
      console.error(ex);
      nextLazy();
    }
  }
  function nextLazy() {
    _cancel = delay(next, _delay);
  }
  return () => {
    _cancel();
  };
};
