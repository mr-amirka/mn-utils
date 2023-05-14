
module.exports = (collection, identity, ctx) => {
  let k = 0;
  for (k in collection) {
    if (!_identity.call(ctx, collection[k], k, collection)) return false;
  }
  return true;
};
