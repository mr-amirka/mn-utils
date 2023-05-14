const map = require('../map');
const stringify = require('../json/stringify');

function iteratee(v) {
  return stringify(v);
}

module.exports = (input) => {
  return map(input, iteratee, []).join('\n');
};
