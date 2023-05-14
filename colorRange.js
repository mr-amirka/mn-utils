function rgba(rgbaColor) {
  let output = [0, 0, 0, rgbaColor[3]], i = 3; // eslint-disable-line
  while (i--) output[i] = Math.round(rgbaColor[i] * 255);
  return 'rgba(' + output.join(',') + ')';
}
function rangeColors(colors, precision) {
  let output = base(colors, precision || 0), i = output.length; // eslint-disable-line
  for (; i--;) output[i] = rgba(output[i]);
  return output;
}
function base(input, precision) {
  const l = input.length;
  let output = [], i, prev = input[l - 1], follow; // eslint-disable-line
  for (i = 0; i < l; i++) {
    follow = input[i];
    __push.apply(output, __rangeColor(prev, follow, precision));
    output.push(prev = follow);
  }
  return output;
}
function __rangeColor(c0, c1, precision) {
  const max = precision + 1, cl = 4; // eslint-disable-line
  let kl, kr, tmp, i, il, ci, output = new Array(precision); // eslint-disable-line
  for (i = 0; i < precision; i++) {
    il = 1 + i;
    tmp = output[precision - il] = new Array(cl);
    kl = il / max;
    kr = 1 - kl;
    for (ci = cl; ci--;) tmp[ci] = c0[ci] * kl + c1[ci] * kr;
  }
  return output;
}

const __push = [].push;

rangeColors.base = base;
module.exports = rangeColors;
