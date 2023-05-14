module.exports = Object.entries || ((obj) => {
  let output = [], key; // eslint-disable-line
  // eslint-disable-next-line
  for (key in obj) hasOwn(obj, key) && output.push([key, obj[key]]);
  return output;
});
