const sha512 = require('./sha512');
const dealDelay = require('./CancelablePromise').delay;
const jsonStringify = require('./jsonStringify');

function normalizeKey(key) {
  return typeof key === 'object'
    ? sha512(jsonStringify(key))
    : key;
}

const CACHE_EXPIRES_PROMISE = 0;
const CACHE_VALUE = 1;
const CACHE_DESTROY = 2;

module.exports = (expires) => {
  expires || (expires = 3600000);
  const cache = {};
  function __remove(key, item, destroy) {
    (item = cache[key])
      && (destroy = item[CACHE_DESTROY])
      && destroy();
    delete cache[key];
  }
  return {
    set: (key, value, destroy, item, promise) => {
      item = cache[key = normalizeKey(key)];
      if (value === null || value === undefined) {
        if (item) {
          item[CACHE_EXPIRES_PROMISE].cancel();
          delete cache[key];
        }
        return;
      }
      promise = dealDelay(expires, key).then(__remove);
      item ? (
        item[CACHE_EXPIRES_PROMISE].cancel(),
        item[CACHE_EXPIRES_PROMISE] = promise,
        item[CACHE_VALUE] = value,
        item[CACHE_DESTROY] = destroy
      ) : (cache[key] = [promise, value, destroy]);
    },
    get: (key, item) => {
      if (item = cache[key = normalizeKey(key)]) {
        item[CACHE_EXPIRES_PROMISE].cancel();
        item[CACHE_EXPIRES_PROMISE] = dealDelay(expires, key).then(__remove);
        return item[CACHE_VALUE];
      }
    },
    delete: (key, item, destroy) => {
      if (item = cache[key = normalizeKey(key)]) {
        (destroy = item[CACHE_DESTROY]) && destroy();
        item[CACHE_EXPIRES_PROMISE].cancel();
        delete cache[key];
      }
    },
  };
};

/*
const cache = cacheProvider();
const getCache = cache.get;
const setCache = cache.set;
*/
