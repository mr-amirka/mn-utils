/*
scopeSplit('not(.disabled(.as).lak).checked', '(', ')');
// =>
[
  'not',
  [
    '.disabled',
    [
      '.as',
    ],
    '.lak',
  ],
  '.checked',
]
*/

const startsWith = require('./startsWith');
const push = require('./push');


module.exports = (input, startKey, endKey, escapeExp, ignoreCloseSyntax) => {
  escapeExp = escapeExp || '';
  startKey = startKey || '(';
  endKey = endKey || ')';
  let startLevel = [], level = startLevel, levels = [level], startL = startKey.length, // eslint-disable-line
    endL = endKey.length, offset = 0, prevLevel, start, escapeL = escapeExp.length, // eslint-disable-line
    depth = 0, lastOffset = 0, length = input.length; // eslint-disable-line
  function is(token) {
    return startsWith(input, token, offset);
  }
  function pushFragment(_offset) {
    push(level, input.substr(lastOffset, _offset - lastOffset));
  }
  function throwError() {
    throw new Error('Scope syntax error: "' + input + '"');
  }
  function scopeClose() {
    --depth;
    depth < 0 && throwError();
    level = levels[depth];
  }
  while (offset < length) {
    if (escapeExp && is(escapeExp)) {
      offset += escapeL + 1;
      continue;
    }
    start = is(startKey);
    if (start || is(endKey)) {
      pushFragment(offset);
      if (start) {
        depth++;
        prevLevel = level;
        level = levels[depth] = [];
        push(prevLevel, level);
        offset += startL;
      } else {
        scopeClose();
        offset += endL;
      }
      lastOffset = offset;
      continue;
    }
    offset++;
  }

  lastOffset < length && pushFragment(length);
  depth && !ignoreCloseSyntax && throwError();

  return startLevel;
};
