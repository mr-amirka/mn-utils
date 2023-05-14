const concat = require('./concat');
const slice = require('./slice');


module.exports = (fn, ctx) => {
  const length = fn.length;
  function base(args) {
    return function() {
      const _args = concat(args, slice(arguments)); // eslint-disable-line
      return _args.length >= length
        ? fn.apply(ctx || this, _args)
        : base(_args);
    };
  }
  return base([]);
};
