const delayFn = require('./delay');


module.exports = (fn, delay, ctx) => {
  let _called, _calledNext, _args; // eslint-disable-line
  function exec() {
    _calledNext
      ? (
        _calledNext = 0,
        delayFn(exec, delay),
        fn.apply(ctx, _args)
      )
      : (_called = 0);
  }
  return function() {
    _args = arguments; // eslint-disable-line
    _called
      ? (_calledNext = 1)
      : (_called = 1, delayFn(exec, delay), fn.apply(ctx, _args));
  };
};
