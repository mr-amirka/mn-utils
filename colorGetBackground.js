const color = require('./color');
const push = require('./push');
const pushArray = require('./pushArray');
const splitProvider = require('./splitProvider');
const camelToKebabCase = require('./camelToKebabCase');
const joinSpace = require('./joinSpace');
const joinComma = require('./joinComma');
const regexpBg
  = /^(---?[^;]+;?|[A-Fa-f0-9]+(\.[0-9]+)?)(p([0-9]+)([a-z%]*))?$/i;
const regexpAngle = /^(.*)((\_r)_?([A-Za-z_]*)|\_g(\-?[0-9]+))$/i;
const regexpRepeat = /^(.*)_rpt$/i;
const regexpDelimeter = /--[^;]+(;[^-]*)?|[^-]+/gim;
const splitSuffix = splitProvider(/_+/);


module.exports = (input, alt) => {
  let radial, repeating, matches, angle = 180, i, v = input; // eslint-disable-line
  if (matches = regexpRepeat.exec(v)) {
    repeating = 1;
    v = matches[1];
  }
  if (matches = regexpAngle.exec(v)) {
    v = matches[1];
    matches[3]
      ? (radial = joinSpace(
          splitSuffix(camelToKebabCase(matches[4] || 'circle')),
      ))
      : (
        angle = (angle + ((i = matches[5]) ? parseInt(i) : 0)) % 360,
        angle < 0 && (angle += 360)
      );
  }
  const vls = v.match(regexpDelimeter);
  const l = vls.length;
  const end = Math.max(l - 1, 1);
  const prefix = (repeating ? 'repeating-' : '')
    + (radial ? 'radial' : 'linear')
    + '-gradient(' + (radial || ('' + angle + 'deg'));
  const gradient = [], outputRgb = [prefix], outputRgba = [prefix]; // eslint-disable-line
  let alts, rgb, rgba, suffix, pmatches, hasAlpha; // eslint-disable-line
  for (i = 0; i < l; i++) {
    pmatches = regexpBg.exec(v = vls[i]) || [];
    suffix = ' '
      + (pmatches[4] || (end ? Math.round(i * 100 / end) : 0))
      + (pmatches[5] || '%');
    alts = color(
        pmatches[1] || v || Math.round(i * 15 / end).toString(16), alt,
    );
    i || pushArray(gradient, alts); // eslint-disable-line
    rgb = alts[0];
    (rgba = alts[1]) ? (hasAlpha = 1) : (rgba = rgb);
    push(outputRgb, rgb + suffix);
    push(outputRgba, rgba + suffix);
  }
  return alt
    ? (
      l > 1 && (
        push(gradient, joinComma(outputRgb) + ')'),
        hasAlpha && push(gradient, joinComma(outputRgba) + ')')
      ),
      gradient
    )
    : (
      l > 1
        ? [joinComma(hasAlpha ? outputRgba : outputRgb) + ')']
        : gradient
    );
};
