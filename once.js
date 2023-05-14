module.exports = function() {
  let _self = arguments; // eslint-disable-line
  return function() {
    if (_self) {
      const self = _self;
      _self = 0;
      return self[0].apply(self[1], self[2] || arguments); // eslint-disable-line
    }
  };
};
