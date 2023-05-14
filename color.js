const lowerFirst = require('./lowerFirst');

const regexpTrimZero = /^0+|0+$/g;
const regexpColor = /^([A-Fa-f0-9]+)(\.[0-9]+)?$/;
const regexpVar = /^(-)?(--[^;,]+)(,([^;]+))?;?$/;

const MULTIPLIER = 1.0 / 255;
const MULTIPLIER_ONE = 1.0 / 15;

const SYNONYMS = {
  CT: 'currentColor',
  T: 'Transparent',
};

function color(v, alt, m, symonym) {
  return (symonym = SYNONYMS[v])
    ? [symonym]
    : (
      (m = regexpVar.exec(v))
        ? [(m[1] == '-' ? 'env' : 'var')
          + '(' + m[2] + (m[4] ? (',' + m[4]) : '') + ')']
        : (
          (m = regexpColor.exec(v))
            ? base(normalize(m[1], m[2]), alt)
            : [lowerFirst(v)]
        )
    );
}
function one(v) {
  return parseInt(v, 16) * MULTIPLIER_ONE;
}
function double(v, start) {
  return parseInt(v.substr(start, 2), 16) * MULTIPLIER;
}
function normalize(v, alpha, w, l) {
  alpha = alpha ? parseFloat('0' + alpha) : 1;
  if (!v) return [0, 0, 0, alpha];
  l = v.length;
  if (l < 2) {
    v = one(v);
    return [v, v, v, alpha];
  }
  if (l < 3) {
    w = one(v[0]);
    return [w, w, w, one(v[1])];
  }
  if (l < 4) return [one(v[0]), one(v[1]), one(v[2]), alpha];
  if (l < 5) return [one(v[0]), one(v[1]), one(v[2]), one(v[3])];
  if (l < 6) return [one(v[0]), one(v[1]), one(v[2]), double(v, 3)];
  if (l < 7) return [double(v, 0), double(v, 2), double(v, 4), alpha];
  if (l < 8) return [double(v, 0), double(v, 2), double(v, 4), one(v[6])];
  return [
    double(v, 0), double(v, 2), double(v, 4),
    l < 8
      ? one(v[6])
      : double(v, 6),
  ];
}
function base(rgbaColor, alt) {
  let tmp = [0, 0, 0], i = 3, alpha = rgbaColor[3], v; // eslint-disable-line
  while (i--) tmp[i] = Math.round(rgbaColor[i] * 255);
  return alpha < 1 ? (
    v = 'rgba(' + tmp.join(',') + ','
      + (alpha ? alpha.toFixed(2).replace(regexpTrimZero, '') : '0') + ')',
    alt ? [rgbStringify(tmp), v] : [v]
  ) : [rgbStringify(tmp)];
}
function rgbStringify(rgb) {
  let v, output = [0, 0, 0], i = 3, one = 1 // eslint-disable-line
  while (i--) {
    v = rgb[i].toString(16);
    if (v.length < 2) v = '0' + v;
    if (v[0] != v[1]) one = 0;
    output[i] = v;
  }
  return '#' + (
    one
      ? ('' + output[0][0] + output[1][0] + output[2][0])
      : output.join('')
  );
}

color.one = one;
color.double = double;
color.normalize = normalize;
color.base = base;
color.rgbStringify = rgbStringify;
module.exports = color;
