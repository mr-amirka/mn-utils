const read = require('../read');

module.exports = (path, onInit) => {
  return read(path).catch((error) => {
    console.warn('Original snapshot in not available', path, error);
    return read(path + '.recov').catch((error) => {
      console.error('Recovery snapshot in not available', path, error);
      return onInit ? onInit() : null;
    });
  });
};
