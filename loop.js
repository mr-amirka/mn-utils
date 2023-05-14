module.exports = (length, fn, start) => {
  for (start = start || 0; start < length; start++) fn(start);
};
