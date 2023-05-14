module.exports = Object.values || function(obj) {
  var output = [], prop; // eslint-disable-line
  for (prop in obj) output.push(obj[prop]); // eslint-disable-line
  return output;
};
