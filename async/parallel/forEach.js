const loopParallel = require('./loop');


module.exports = (items, fn, ctx, taskLimit) => {
  const length = items && items.length || 0;
  let index = 0;
  return loopParallel(() => index < length, () => {
    const i = index++;
    return fn.call(ctx, items[i], i, items);
  }, taskLimit);
};
