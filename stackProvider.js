const isDefined = require('./isDefined');

module.exports = () => {
  // eslint-disable-next-line
  let first = [0, 0], last = first;
  return {
    pop: (_next) => {
      if (_next = first[1]) {
        first = _next;
        return _next[0];
      }
    },
    push: (data) => {
      isDefined(data) && (last = last[1] = [data, 0]);
    },
    eachPop: (iteratee, _next) => {
      while (_next = first[1]) {
        first = _next;
        iteratee(_next[0]);
      }
    },
    has: (_next) => {
      return !!first[1];
    },
  };
};
