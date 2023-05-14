const isDefined = require('./isDefined');

const regexpSign = /^(-)(.+)$/;
// const regexpSpace = /[^0-9.-]/g;
const regexpSpace = /\s+/g;
const regexpDot = /^(.*)\.(.*?)$/;
const regexpDots = /\./g;

function base(num) {
  if (!isDefined(num)) return null;
  let val = '', sign = '', right = '', matched; // eslint-disable-line
  num && (val = ('' + num).replace(regexpSpace, ''));

  if (matched = regexpSign.exec(val)) {
    sign = matched[1];
    val = matched[2];
  }
  if (matched = regexpDot.exec(val)) {
    val = matched[1].replace(regexpDots, '');
    right = matched[2];
  }
  return val || right ? [sign, val, right] : null;
}
function parse(num) {
  const parts = base(num);
  if (!parts) return null;
  const right = parts[2];
  return parseFloat(parts[0] + (parts[1] || '0') + (right ? '.' + right : ''));
}

parse.base = base;
module.exports = parse;
