const write = require('../write');

module.exports = (path, data, minify) => {
  return write(path, data, minify).then(() => {
    return write(path + '.recov', data, minify);
  });
};
