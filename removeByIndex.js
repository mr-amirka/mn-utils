const isDefined = require('./isDefined');


module.exports = (collection, index, length) => {
  const inputLength = collection && collection.length || 0;
  index = Math.min(inputLength, Math.max(0, index));
  length = isDefined(length) ? length : 1;
  const output = new Array(Math.min(inputLength, index)
    + Math.max(0, inputLength - index - length));
  let i = 0;
  for (;i < index; i++) {
    output[i] = collection[i];
  }
  for (i = index + length; i < inputLength; i++) {
    output[i - length] = collection[i];
  }
  return output;
};
