const slice = require('./slice');
const pushArray = require('./pushArray');
const __concat = [].concat;

module.exports = __concat ? function(self) {
  return __concat.apply(self, slice(arguments, 1)); // eslint-disable-line
} : function() {
  let args = arguments, l = args.length, i = 0, output = []; // eslint-disable-line
  for (; i < l; i++) pushArray(output, args[i]);
  return output;
};
