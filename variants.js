const map = require('./map');
const unslash = require('./unslash');
const escapedSplitProvider = require('./escapedSplitProvider');
const joinArrays = require('./joinArrays');
const push = require('./push');
const pushArray = require('./pushArray');
const joinOnly = require('./joinOnly');


// Экранирование служебных символов
const __split = escapedSplitProvider('|').base; // support escape
const regexpScope = /([^)(\\]+|\\.)|([\(\)])/gi;

function variants(exp) {
  return map(base(exp), unslash);
}
function build(childs) {
  // eslint-disable-next-line
  let length = childs.length, output = [], parts, child, end, pi, pl, i = 0,
    next, prev = [''];
  for (; i < length; i++) {
    child = childs[i];
    parts = __split(child[0]);
    pl = parts.length;
    end = pl - 1;
    joinArrays([parts[end]], build(child[1]), '', next = []);
    if (end) {
      joinArrays(prev, [parts[0]], '', output);
      prev = next;
      for (pi = 1; pi < end; pi++) push(output, parts[pi]);
    } else {
      prev = joinArrays(prev, next);
    }
  }
  return pushArray(output, prev);
}
function base(exp) {
  // eslint-disable-next-line
  let levels = {}, childs = levels[0] = [], depth = 0, parts = [];
  exp.replace(regexpScope, (haystack, _prefix, scope) => {
    if (_prefix) {
      push(parts, _prefix);
      return '';
    }
    let last;
    if (scope == '(') {
      push(
          levels[depth] || (levels[depth] = []),
          last = [joinOnly(parts), 0],
      );
      depth++;
      levels[depth] = last[1] = [];
    } else {
      push(levels[depth], [joinOnly(parts), []]);
      if (--depth < 0) depth = 0;
    }
    parts = [];
    return '';
  });
  parts.length && push(levels[depth], [joinOnly(parts), []]);
  return build(childs);
}

module.exports = variants;
variants.build = build;
variants.base = base;
