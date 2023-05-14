
module.exports = (collection, iteratee, output, ctx) => {
  output = output || {};
  let k;
  for (k in collection) { // eslint-disable-line
    output[k] = iteratee.call(ctx, collection[k], k, collection);
  }
  return output;
};
