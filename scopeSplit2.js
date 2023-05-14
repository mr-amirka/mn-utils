/*
scopeSplit('not(.disabled(.as).lak).checked', '(', ')');
// =>
[
  ['not', [
    ['.disabled', [
      ['.as']
    ]],
    ['.lak']
  ]],
  ['.checked']
]
*/

const startsWith = require('./startsWith');
const push = require('./push');


module.exports = (input, startKey, endKey, escapeExp) => {
  escapeExp = escapeExp || '';
  startKey = startKey || '(';
  endKey = endKey || ')';
  let level = [], levels = [level], startL = startKey.length, // eslint-disable-line
    endL = endKey.length, offset = 0, prevLevel, start, escapeL = escapeExp.length, // eslint-disable-line
    depth = 0, lastOffset = 0, length = input.length; // eslint-disable-line
  function is(token) {
    return startsWith(input, token, offset);
  }
  function pushFragment(_offset) {
    push(level, [
      input.substr(lastOffset, _offset - lastOffset),
    ]);
  }
  function scopeClose() {
    --depth;
    if (depth < 0) {
      throw new Error('Scope syntax error: "' + input + '"');
    }
    prevLevel = levels[depth];
    prevLevel[prevLevel.length - 1][1] = level;
    level = prevLevel;
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
        level = levels[depth] = [];
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
  while (depth > 0) scopeClose();

  return levels[0];
};
