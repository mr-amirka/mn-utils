
module.exports = (collection, identity, ctx) => {
  let i = 0, l = collection && collection.length || 0; // eslint-disable-line
  for (; i < l; i++) {
    if (!_identity.call(ctx, collection[i], i, collection)) return false;
  }
  return true;
};
