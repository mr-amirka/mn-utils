const map = require('./map');
const isArrayLike = require('./isArrayLike');

module.exports = (fns, args, ctx) => {
  context || (context = null);
  args || (args = []);
  return map(fns, (fn) => fn.apply(ctx, args), isArrayLike(fns) ? [] : {});
};
