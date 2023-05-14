module.exports = (obj) => {
  let output = [], key; // eslint-disable-line
  for (key in obj) output.push([key, obj[key]]); // eslint-disable-line
  return output;
};
