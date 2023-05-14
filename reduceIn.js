
module.exports = (collection, iteratee, accumulator, ctx) => {
  let k;
  for (k in collection) { //eslint-disable-line
    accumulator = iteratee.call(ctx, accumulator, collection[k], k, collection);
  }
  return accumulator;
};
