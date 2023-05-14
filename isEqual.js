/**
 * @overview isEqual
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 */

module.exports = (src1, src2, depth) => !isNotEqual(src1, src2, depth || 0);
function isNotEqual(src1, src2, depth) {
  if (src1 === src2) return;
  if (depth < 0) return 1;
  const t1 = typeof src1, t2 = typeof src2; // eslint-disable-line
  if (t1 !== t2 || t1 !== 'object' || !src1 || !src2) return 1;
  depth--;
  let k, cache = {}; // eslint-disable-line
  for (k in src1) { // eslint-disable-line
    if (isNotEqual(src1[k], src2[k], depth)) return 1;
    cache[k] = 1;
  }
  for (k in src2) {
    if (!cache[k] && isNotEqual(src1[k], src2[k], depth)) return 1;
  }
};
