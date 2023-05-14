const isArray = require('./isArray');
const concat = require('./concat');
const indexOf = require('./indexOf');


const toJsonSerializable = module.exports = (v) => base(v, []);
const base = toJsonSerializable.base = (v, excludes) => {
  const t = typeof v;
  if (v === undefined || t === 'function') {
    return null;
  }
  if (!v || typeof v !== 'object') {
    return v;
  }
  if (indexOf(excludes, v) > -1) {
    return null;
  }
  let l = v.length, k, output; // eslint-disable-line
  excludes = concat(excludes, [v]);
  if (isArray(v)) {
    for (k = 0, output = new Array(l); k < l; k++) {
      output[k] = base(v[k], excludes);
    }
    return output;
  }
  output = {};
  for (k in v) { // eslint-disable-line
    output[k] = base(v[k], excludes);
  }
  return output;
};
