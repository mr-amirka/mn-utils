const __splice = [].splice;
module.exports = (collection, v) => {
  let length = collection && collection.length || 0, i = length; // eslint-disable-line
  while (i--) v === collection[i] && __splice.call(collection, i, 1);
  return length - collection.length;
};
