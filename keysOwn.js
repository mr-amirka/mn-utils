const hasOwn = require('./hasOwn');

module.exports = Object.keys || ((obj) => {
  let output = [], key; // eslint-disable-line
  // eslint-disable-next-line
  for (key in obj) hasOwn(obj, key) && output.push(key);
  return output;
});
