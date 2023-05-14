const slice = require('./slice');
const concat = require('./concat');


module.exports = (fn, ctx, args) => {
  args = slice(args || []);
  return function() {
    // eslint-disable-next-line
    return fn.apply(ctx, concat(args, slice(arguments)));
  };
};
