
module.exports = (params) => {
  const output = {};
  base('', params);
  return output;

  function base(prefix, value) {
    if (!value || typeof value != 'object') {
      output[prefix] = value;
      return;
    }

    prefix && (prefix += '.');

    if (value instanceof Array) {
      for (let l = value.length, i = 0; i < l; i++) {
        base(prefix + i, value[i]);
      }
      return;
    }
    
    for (let k in value) {
      base(prefix + k, value[k]);
    }
  }
};