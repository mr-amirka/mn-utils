/*
scopeJoin([
  ['not', [
    ['.disabled', [
      ['.as']
    ]],
    ['.lak']
  ]],
  ['.checked']
], '(', ')'); // => 'not(.disabled(.as).lak).checked'
*/

const push = require('./push');
const joinOnly = require('./joinOnly');

module.exports = (scope, start, end) => {
  start = start || '(';
  end = end || ')';
  let output = []; // eslint-disable-line
  base(scope);
  return joinOnly(output);

  function base(scope) {
    let i = 0, l = scope.length, item, inner; // eslint-disable-line
    for (;i < l; i++) {
      item = scope[i];
      push(output, item[0]);
      inner = item[1];
      inner && (
        push(output, start),
        base(inner),
        push(output, end)
      );
    }
  }
};
