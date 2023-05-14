module.exports = (fn, result, ctx) => {
  return function() {
    fn.apply(ctx, arguments); // eslint-disable-line
    return result;
  };
};
