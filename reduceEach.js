
module.exports = (collection, iteratee, accumulator, ctx) => {
  let l = collection && collection.length || 0, i = 0; // eslint-disable-line
  for (; i < l; i++) {
    accumulator = iteratee.call(ctx, accumulator, collection[i], i, collection);
  }
  return accumulator;
};
