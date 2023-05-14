module.exports = (fn, ctx, result) => {
  let _locked;
  return function() {
    _locked || (
      _locked = 1,
      fn.apply(ctx, arguments), // eslint-disable-line
      _locked = 0
    );
    return result;
  };
};
