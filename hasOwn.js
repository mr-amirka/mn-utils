const hasOwnProperty = Object.prototype.hasOwnProperty;

module.exports = Object.hasOwn
  || ((obj, key) => hasOwnProperty.call(obj, key));
