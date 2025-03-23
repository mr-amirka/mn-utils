const loopAsync = require('./loop');

module.exports = (items, fn, ctx) => {
  const length = items && items.length || 0;
  let index = 0;
  return loopAsync(() => index < length, () => {
    const i = index++;
    return fn.call(ctx, items[i], i, items);
  });
};
