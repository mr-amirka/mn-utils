const _global = require('./_global');
const getBase = require('./get/base');


module.exports = (className) => {
  className = ('' + className).split('.');
  return (instance) => {
    const _Class = getBase(_global, className);
    return _Class && instance && (instance instanceof _Class);
  };
};
