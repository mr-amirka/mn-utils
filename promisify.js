const isFunction = require('./isFunction');


module.exports = (fn, _Promise) => {
  isFunction(_Promise) || (_Promise = Promise);
  return function() {
    const self = this, args = [].slice.call(arguments); // eslint-disable-line
    return new _Promise((resolve, reject) => {
      args.push((error, result) => {
        error
          ? reject(error)
          : resolve(result);
      });
      return fn.apply(self, args);
    });
  };
};
