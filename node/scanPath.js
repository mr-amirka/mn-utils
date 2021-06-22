const fs = require('fs');
const Path = require('path');
const finallyAll = require('../finallyAll');
const noop = require('../noop');

const regexpPath = /^\.?\.?\/.*/;
const regexpNormalize = /\\/gim;

module.exports = ({path, each, callback, exclude}) => {
  finallyAll((inc, dec) => {
    const _each = each || noop;
    const _exclude = exclude || noop;
    function base(path) {
      inc();
      path = path.replace(regexpNormalize, '/');
      regexpPath.test(path) || (path = './' + path);
      function iteratee(name) {
        base(Path.join(path, name));
      }
      fs.stat(path, (err, stat) => {
        if (!stat) return dec();
        if (stat.isDirectory()) {
          fs.readdir(path, (err, list) => {
            list && list.forEach(iteratee);
            dec();
          });
        } else {
          _exclude(path) || _each('found', path);
          dec();
        }
      });
    }
    base(path);
  }, callback);
};
