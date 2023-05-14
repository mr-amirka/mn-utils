/**
 * @overview param
 * - конструктор GET парметров url
 *
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 */

const withoutEmpty = require('./withoutEmpty');
const isObject = require('./isObject');
const isArray = require('./isArray');
const jsonStringify = require('./jsonStringify');

const PARAM_WITHOUT_EMPTY_DEFAULT_DEPTH = 10;
function param(v, s, k, l) {
  if (!isObject(v)) return '';
  s = [];
  function paramBuild(p, v) {
    v = withoutEmpty(v, PARAM_WITHOUT_EMPTY_DEFAULT_DEPTH);
    v === null || s.push(paramEscape(p) + '=' + paramEscape(
      isObject(v) ? jsonStringify(v) : ('' + v),
    ));
    return s;
  }
  if (isArray(v)) {
    for (k = 0, l = v.length; k < l; k++) paramBuild('' + k, v[k]);
  } else {
    for (k in v) paramBuild(k, v[k]); // eslint-disable-line
  }
  return s.sort().join('&');
}
function paramEscape(v) {
  return encodeURIComponent(v)
      .replace(/%20/g, '+')
      .replace(/%22/g, '"')
      .replace(/%3A/g, ':')
      .replace(/%2C/g, ',');
}

param.escape = paramEscape;
module.exports = param;
