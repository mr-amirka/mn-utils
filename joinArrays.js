
module.exports = (prefixes, suffixes, separator, output) => {
  separator = separator || '';
  output = output || [];
  const pl = prefixes.length;
  let prefix, si, sl, pi = 0; // eslint-disable-line
  for (; pi < pl; pi++) { // eslint-disable-line
    // eslint-disable-next-line
    for (prefix = prefixes[pi] + separator, sl = suffixes.length, si = 0; si < sl; si++) {
      output.push(prefix + suffixes[si]);
    }
  }
  return output;
};
