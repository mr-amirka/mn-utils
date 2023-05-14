const baseGet = require('./get').base;
const noopHandle = require('./noopHandle');
const defaultPath = ['value'];


module.exports = (set) => {
  return (name, prop, map) => {
    map = map || noopHandle;
    prop = prop ? prop.split('.') : defaultPath;
    return (e) => {
      set({[name]: map(baseGet(e && e.target, prop))});
    };
  };
};
