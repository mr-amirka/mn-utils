const create = require('./create');
const extend = require('./extend');
const pushArray = require('./pushArray');


module.exports = (Parent, constructor, proto) => {
  function Child() {
    const self = this;
    constructor.apply(self, pushArray([self, function() {
      return Parent.apply(self, arguments); // eslint-disable-line
    }], arguments)); // eslint-disable-line
  }
  Child.prototype = extend(create(Parent.prototype), proto);
  return Child;
};
