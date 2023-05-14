module.exports = (parts) => {
  return (scope) => {
    let i = 0, l = parts.length, output = new Array(l); // eslint-disable-line
    for (; i < l; i++) output[i] = parts[i](scope);
    return output.join('');
  };
};
