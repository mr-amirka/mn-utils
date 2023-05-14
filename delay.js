/**
 * @overview delay
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 *
 * Here "setTimeout" function is run twice to fixed bug in some browsers.
 * Sometimes "setTimeout" does not start in the Chrome, Firefox.
 * It is observed in rare cases.
 * Discovered in 2021.
 */

module.exports = (fn, delay, args, ctx) => {
  function base() {
    const _fn = fn;
    _fn && (
      fn = 0,
      _fn.apply(ctx, args || [])
    );
  }
  let _t1 = setTimeout(base, delay || 0), _t2 = setTimeout(base, delay || 0);  // eslint-disable-line
  return () => {
    fn = 0;
    clearTimeout(_t1);
    clearTimeout(_t2);
  };
};
