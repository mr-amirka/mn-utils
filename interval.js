/**
 * @overview interval
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 */

module.exports = (fn, delay, args, ctx) => {
  const intervalId = setInterval(() => {
    fn.apply(ctx || null, args || []);
  }, delay || 0);
  return () => {
    clearInterval(intervalId);
  };
};
