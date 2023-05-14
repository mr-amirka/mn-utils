const isObject = require('./isObject');

module.exports = Object.create || function(proto) {
  if (!isObject(proto)) {
    throw new TypeError('Object prototype may only be an Object: ' + proto);
  }
  function F() {}
  F.prototype = proto;
  return new F();
};
