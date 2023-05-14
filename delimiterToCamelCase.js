const toUpper = require('./toUpper');

module.exports = (v, delimiter) => {
  const words = v.split(delimiter);
  const length = words.length;
  for (let i = 1, word; i < length; i++) {
    words[i] = toUpper((word = words[i]).substr(0, 1)) + word.substr(1);
  }
  return words.join('');
};
