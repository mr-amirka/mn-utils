
module.exports = (collection, iteratee, output, ctx) => {
  const length = collection && collection.length || 0;
  let i = 0;
  output = output || new Array(length);
  for (; i < length; i++) {
    output[i] = iteratee.call(ctx, collection[i], i, collection);
  }
  return output;
};
