
module.exports = (prefixes, suffix, output) => {
  output = output || {};
  let prefix;
  for (prefix in prefixes) output[prefix + suffix] = 1; // eslint-disable-line
  return output;
};
