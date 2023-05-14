const flagsByString = require('./flagsByString');
const deflagsByString = require('./deflagsByString');
const extend = require('./extend');
module.exports = (v, flags, suffix) => {
  return deflagsByString(extend(flagsByString(v), flags), suffix);
};
