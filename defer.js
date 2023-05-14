const delay = require('./delay');

module.exports = (fn, args, ctx) => {
  try {
    function base() {
      const _fn = fn;
      _fn && (
        fn = 0,
        _fn.apply(ctx, args || [])
      );
    }
    let _t1 = setImmediate(base), _t2 = setImmediate(base);  // eslint-disable-line
    return () => {
      fn = 0;
      clearImmediate(_t1);
      clearImmediate(_t2);
    };
  } catch (ex) {
    return delay(fn, 0, args, ctx);
  }
};
