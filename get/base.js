
module.exports = (ctx, path, def) => {
  let length = path.length, i = 0; // eslint-disable-line
  while (ctx && i < length) ctx = ctx[path[i++]];
  return i === length ? ctx : def;
};
