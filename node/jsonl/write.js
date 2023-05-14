const {
  createWriteStream,
  mkdir,
} = require('fs');
const {
  dirname,
} = require('path');
const TransformTo = require('./TransformTo');


module.exports = (path, options) => {
  const writable = new TransformTo();
  const dname = dirname(path);
  dname ? mkdir(dname, {
    recursive: true,
  }, write) : write();
  function write(error) {
    error
      ? writable.destroy(error)
      : writable.pipe(createWriteStream(path, {
        ...(options || {}),
        encoding: 'utf8',
      }));
  }
  return writable;
};
