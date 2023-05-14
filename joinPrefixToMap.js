
module.exports = (prefix, suffixes, output) => {
  output = output || {};
  let suffix;
  for (suffix in suffixes) output[prefix + suffix] = 1; // eslint-disable-line
  return output;
};
