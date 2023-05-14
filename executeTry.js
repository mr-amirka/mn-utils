module.exports = (fn, args, context, onError) => {
  try {
    return fn.apply(context, args || []);
  } catch (ex) {
    onError && onError(ex);
  }
};
