/**
 * @overview range
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 */


module.exports = (end, start, step) => {
  start || (start = 0);
  step || (step = 1);
  step < 0 && (step = -step);
  const length = (end - start) / step;
  const sign = length < 0 ? -1 : 1;
  length *= sign;
  const output = new Array(length);
  for (let i = 0; i < length; i++) output[i] = start + i * step * sign;
  return output;
};
