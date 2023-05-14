const slice = require('./slice');
const __startsWith = ''.startsWith;

module.exports = __startsWith ? (function(self) {
  return __startsWith.apply(self, slice(arguments, 1)); // eslint-disable-line
}) : ((self, searchString, position) => {
  position = position || 0;
  return self.indexOf(searchString, position) === position;
});
