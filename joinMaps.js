
module.exports = (prefixes, suffixes, separator, output) => {
  separator = separator || '';
  output = output || {};
  let prefix, suffix, p; // eslint-disable-line
  for (prefix in prefixes) { // eslint-disable-line
    p = prefix + separator;
    for (suffix in suffixes) output[p + suffix] = 1; // eslint-disable-line
  }
  return output;
};
