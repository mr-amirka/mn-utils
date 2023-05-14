const push = require('../push');
const escapeQuote = require('../escapeQuote');
const isArray = require('../isArray');
const isLength = require('../isLength');
const concat = require('../concat');
const indexOf = require('../indexOf');
const repeat = require('../repeat');
const toJsonSerializable = require('../toJsonSerializable');
const originStringify = require('../support')('JSON.stringify');

const REGEXP_INCLUDE_TYPES = /object|string|boolean|number/;

module.exports = originStringify
  ? ((value, replacer, space, ignoreRecursion) => {
    return originStringify(
        ignoreRecursion ? toJsonSerializable(value) : value,
        replacer || null,
        space || '',
    );
  })
  : stringify;


function defaultReplacer(k, v) {
  return v;
}
function includesIteratee(v) {
  return '' + v;
}
function getReplacer(includes) {
  includes = map(includes, includesIteratee);
  return (k, v) => indexOf(includes, '' + k) > -1 ? v : undefined;
}

function stringify(value, replacer, space, ignoreRecursion) {
  replacer = isArray(replacer)
    ? getReplacer(replacer)
    : replacer || defaultReplacer;
  space = isLength(space) ? repeat(' ', space) : (space || '');
  const lineEnd = space ? '\n' : '';
  const arrStart = '[' + lineEnd;
  const objStart = '{' + lineEnd;
  const comma = ',' + lineEnd;
  const separator = '":' + (space ? ' ' : '');
  function base(v, indent, excludes, property) {
    const type = typeof v;
    if (type === 'string') {
      return '"' + escapeQuote(v) + '"';
    }
    if (type === 'number') {
      return '' + v;
    }
    if (type === 'boolean') {
      return v ? 'true' : 'false';
    }
    if (v === null || type !== 'object') return 'null';
    if (indexOf(excludes, v) > -1) {
      if (ignoreRecursion) {
        return null;
      }
      throw new Error('Converting circular structure to JSON'
        + (property ? ' in property "' + property + '"': ''));
    }
    excludes = concat(excludes, [v]);
    // eslint-disable-next-line
    let indentNext = indent + space, length = v.length, k, output = [], tmp;
    if (isArray(v)) {
      for (k = 0; k < length; k++) {
        push(output, base(replacer(k, v[k]), indentNext, excludes, k));
      }
      return length
        ? arrStart + indentNext + output.join(comma + indentNext) + lineEnd
          + indent + ']'
        : '[]';
    }
    for (k in v) { // eslint-disable-line
      tmp = replacer(k, v[k]);
      REGEXP_INCLUDE_TYPES.test(typeof tmp)
        && push(output, '"' + escapeQuote(k) + separator
        + base(tmp, indentNext, excludes, k));
    }
    return output.length
      ? objStart + indentNext + output.join(comma + indentNext) + lineEnd
        + indent + '}'
      : '{}';
  }
  return base(value, '', []);
}
