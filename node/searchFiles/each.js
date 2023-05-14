const fs = require('fs');
const pathLib = require('path');
const CancelablePromise = require('../../CancelablePromise');
const noop = require('../../noop');

function defaultFilter() {
  return true;
}

module.exports = (folderPath, options) => {
  return new CancelablePromise((resolve, reject) => {
    options || (options = {});
    const filter = options.filter || defaultFilter;
    const iteratee = options.iteratee || noop;
    let _stop = false;
    let _taskCount = 0;

    base(folderPath, pathLib.basename(folderPath), 0);

    function dec() {
      --_taskCount || resolve();
    }
    function base(path, name, depth) {
      _taskCount++;
      fs.lstat(path, (err, stats) => {
        if (_stop) {
          return;
        }
        if (err) {
          return dec();
        }
        const isDir = stats.isDirectory();
        if (!filter(name, isDir, depth)) {
          return dec();
        }
        if (!isDir) {
          iteratee(path);
          return dec();
        }
        fs.readdir(path, (err, files) => {
          if (_stop) {
            return;
          }
          if (err) {
            return dec();
          }
          const nextDepth = depth + 1;
          const length = files.length;
          let i = 0;
          let name;
          for (; i < length; i++) {
            name = files[i];
            base(pathLib.join(path, name), name, nextDepth);
          }
          dec();
        });
      });
    }
    return () => {
      _stop = true;
    };
  });
};
