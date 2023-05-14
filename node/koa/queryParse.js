/**
 * @overview
 * Middleware:
 * - парсит GET-параметры, сериализовнные в JSON.
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 */

module.exports = (ctx, next) => {
  const q = ctx.query;
  let k;
  for (k in q) { // eslint-disable-line
    try {
      q[k] = JSON.parse(q[k]);
    } catch (ex) {}
  }
  return next();
};
