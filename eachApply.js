const isArrayLike = require('./isArrayLike');
const each = require('./each');

module.exports = (funcs, args, context) => {
  context || (context = null);
  args || (args = []);
  each(funcs, (fn) => {
    fn.apply(context, args);
  }, isArrayLike(funcs));
};
