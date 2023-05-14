/*
@example
const input = [1, 3, 6, ['fd', [76, 54, 'sdfgf'], 97],
  ['fdds', 7867], 878, 6767, ['fdfd']];
console.log(flatten(input));
// => [1, 3, 6, "fd", 76, 54, "sdfgf", 97, "fdds", 7867, 878, 6767, "fdfd"]
*/
const isArray = require('./isArray');

module.exports = (input) => {
  const output = [];
  const stack = [];
  let stackItem = [input, 0];
  let item;
  let offset;
  let length;
  while (stackItem) {
    input = stackItem[0];
    offset = stackItem[1];
    length = input.length;
    while (offset < length) {
      if (isArray(item = input[offset])) {
        stack.push([input, offset + 1]);
        input = item;
        offset = 0;
        length = input.length;
        continue;
      }
      output.push(item);
      offset++;
    }
    stackItem = stack.pop();
  }
  return output;
};
