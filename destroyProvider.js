const forEach = require('./forEach');
const removeOf = require('./removeOf');
const eachApply = require('./eachApply');

function destroyProvider(destroyers) {
  destroyers || (destroyers = []);
  function instance() {
    const _destroyers = destroyers;
    destroyers = 0;
    _destroyers && eachApply(_destroyers);
    return !!_destroyers;
  }
  function add() {
    forEach(arguments, (fn) => { // eslint-disable-line
      destroyers ? destroyers.push(fn) : fn();
    });
    return instance;
  }
  instance.add = add;
  instance.remove = (fn) => {
    removeOf(destroyers, fn);
    return instance;
  };
  instance.child = () => {
    const child = destroyProvider();
    add(child);
    return child;
  };
  instance.isDestroyed = () => {
    return !destroyers;
  };
  instance.clear = () => {
    if (destroyers) destroyers = [];
    return instance;
  };
  return instance;
}
module.exports = destroyProvider;
