const forEach = require('../forEach');
const Observable = require('../Observable');
const tryJsonParse = require('../tryJsonParse');
const jsonStringify = require('../jsonStringify');
const attachEvent = require('../attachEvent');

module.exports = (win) => {
  let locked;
  const instance = new Observable();
  const emit = instance.emit;
  const originLocalStorage = win.localStorage;
  function __set(key, value) {
    emit({key, value});
    return instance;
  }
  function getKeys() {
    const l = originLocalStorage.length;
    const keys = [];
    let i = 0;
    for (; i < l; i++) keys.push(originLocalStorage.key(i));
    return keys;
  }
  attachEvent(win, 'storage', (event) => {
    locked = true;
    emit({
      key: event.key,
      value: tryJsonParse(event.newValue),
    });
    locked = false;
  });
  instance.on(({key, value}) => {
    if (locked) return;
    value === null || value === undefined
      ? originLocalStorage.removeItem(key)
      : originLocalStorage.setItem(key, jsonStringify(value));
  });
  instance.set = __set;
  instance.get = (key) => tryJsonParse(originLocalStorage.getItem(key));
  instance.remove = (key) => __set(key, null);
  instance.getKeys = getKeys;
  instance.clear = () => {
    forEach(getKeys(), (key) => {
      emit({key, value: null});
    });
    return instance;
  };
  return instance;
};
