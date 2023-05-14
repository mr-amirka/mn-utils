/**
 * @overview isMatch
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 */

module.exports = (src, matchs, depth) => !isNotMatch(src, matchs, depth || 10);
function isNotMatch(src, matchs, depth) {
  if (src === matchs || depth < 0) return;
  let k,  t1 = typeof src, t2 = typeof matchs; //eslint-disable-line
  if (t1 !== t2 || t1 !== 'object' || !src) return true;
  depth--;
  for (k in matchs) {
    if (isNotMatch(src[k], matchs[k], depth)) return true;
  }
}
