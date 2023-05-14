/**
 * @overview globalNameProvider
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 */

const _global = require('../_global');

let _id = 0;
module.exports = (scope, prefix) => {
  scope || (scope = _global);
  prefix || (prefix = 'CALLBACK_');
  return (fn, suffix) => {
    _id++;
    const name = prefix + _id + (suffix || '');
    scope[name] = function() {
      const res = fn.apply(null, arguments); //eslint-disable-line
      scope[name] = null;
      try {
        delete scope[name];
      } catch (ex) {}
      return res;
    };
    return name;
  };
};
