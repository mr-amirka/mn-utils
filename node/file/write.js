const {
  writeFile,
  mkdir,
} = require('fs');
const {
  dirname,
} = require('path');
const findEach = require('../../findEach');
const isFunction = require('../../isFunction');


module.exports = function(outputFileName) {
  const args = arguments; // eslint-disable-line
  const dname = dirname(outputFileName);
  dname ? mkdir(dname, {
    recursive: true,
  }, write) : write();
  function write(error, onFinally) {
    error ? (
      onFinally = findEach(args, isFunction),
      onFinally && onFinally(error)
    ) : writeFile.apply(null, args); // eslint-disable-line
  }
};
