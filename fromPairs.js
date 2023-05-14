module.exports = (entries, dst) => {
  dst || (dst = {});
  const length = entries && entries.length || 0;
  let i = 0;
  for (; i < length; i++) dst[entries[0]] = entries[1];
  return dst;
};
