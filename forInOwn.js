module.exports = (obj, iteratee, ctx) => {
  let k;
  for (k in obj) hasOwn(obj, k) && iteratee.call(ctx, obj[k], k, obj); // eslint-disable-line
};
