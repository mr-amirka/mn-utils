/**
 * @overview cookieStorageProvider
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 *
 */

const Observable = require('../Observable');
const tryJsonParse = require('../tryJsonParse');
const jsonStringify = require('../jsonStringify');
const keys = require('../keys');

const expires = 400 * 86400000;

function storageInit(cookie) {
  const w = cookie ? cookie.split('; ') : [];
  const l = w.length;
  const output = {};
  let i = 0, parts, k; // eslint-disable-line
  for (; i < l; i++) {
    k = decodeURIComponent((parts = w[i].split('='))[0]);
    output[k] = tryJsonParse(decodeURIComponent(parts[1]));
  }
  return output;
}

module.exports = (ctx) => {
  const instance = new Observable();
  const emit = instance.emit;
  const doc = ctx.document;
  const cache = storageInit(doc.cookie);
  function __set(key, value) {
    const date = new Date();
    date.setMilliseconds(date.getMilliseconds() + expires);
    doc.cookie = encodeURIComponent(key) + '='
      + encodeURIComponent(value) + '; expires=' + date.toUTCString();
  }
  function set(key, value) {
    emit({key, value});
    return instance;
  }
  instance.on(({key, value}) => {
    if (value === cache[key]) return;
    if (value === null || value === undefined) {
      delete cache[key];
      __set(key, '');
    } else {
      __set(key, jsonStringify(cache[key] = value));
    }
  });
  instance.set = set;
  instance.get = (key) => cache[key];
  instance.remove = (key) => set(key, null);
  instance.getKeys = () => keys(cache);
  instance.clear = () => {
    let key;
    for (key in cache) emit({ // eslint-disable-line
      key,
      value: cache[key],
    });
    return instance;
  };
  return instance;
};
