const CancelablePromise = require('../CancelablePromise');
const hasOwn = require('../hasOwn');
const extendOwn = require('../extendOwn');
const setBase = require('../set').base;
const isArray = require('../isArray');
const isObservable = require('../isObservable');
const isPromise = require('../isPromise');
const isDate = require('../isDate');
const isRegExp = require('../isRegExp');
const indexOf = require('../indexOf');
const bindMethods = require('../bindMethods');
const {
  RPC_TYPE_FUNCTION,
  RPC_TYPE_OBJECT,
  RPC_TYPE_ARRAY,
  RPC_TYPE_TIME,
  RPC_TYPE_REGEXP,
} = require('./constants');

const {
  resolve: cancelablePromiseResolve,
} = CancelablePromise;

const REGEXP_NUMBER = /^\d+$/i;
const PROMISE_METHODS = [
  'then',
  'catch',
  'onCancel',
  'finally',
];


function adaptObservable(input$) {
  const {
    on,
  } = input$;
  const output$ = extendOwn({}, input$);
  delete output$._cancel;
  output$.on = (v) => {
    return new CancelablePromise(() => {
      return on(v);
    });
  };
  return output$;
}

module.exports = (src, fns, rootId, compress) => {
  const objects = [];
  const arrays = [];
  const convertedObjects = [];
  const convertedArrays = [];
  const keys = compress ? [] : 0;
  let arrayLastIndex = 0;
  let objectLastIndex = 0;
  let keyLastIndex = 0;

  function base(src, path) {
    if (!src) {
      return src;
    }
    const type = typeof src;
    if (type === 'function') {
      if (!fns) {
        return null;
      }
      setBase(fns, path, src);
      return [RPC_TYPE_FUNCTION, path.join('.')];
    }
    if (type !== 'object') {
      return src;
    }
    if (isDate(src)) {
      return [RPC_TYPE_TIME, src.toISOString()];
    }
    if (isRegExp(src)) {
      return [RPC_TYPE_REGEXP, src.toString()];
    }
    let index, i, k, dst, length, hasPromise; // eslint-disable-line
    if (isArray(src)) {
      index = indexOf(arrays, src);
      if (index === -1) {
        index = arrayLastIndex++;
        arrays[index] = src;
        dst = convertedArrays[index] = new Array(length = src.length);
        for (i = 0; i < length; i++) {
          dst[i] = base(src[i], path.concat([i]));
        }
      }
      return [RPC_TYPE_ARRAY, index];
    }
    index = indexOf(objects, src);
    if (index === -1) {
      index = objectLastIndex++;
      objects[index] = src;
      isObservable(src) && (src = adaptObservable(src));
      isPromise(src) && (src = bindMethods(
          cancelablePromiseResolve(src),
          PROMISE_METHODS,
      ));
      dst = convertedObjects[index] = {};
      for (k in src) { // eslint-disable-line
        if (hasOwn(src, k)) {
          i = k;
          if (compress && (k.length > 2 || REGEXP_NUMBER.test(k))) {
            i = indexOf(keys, k);
            if (i === -1) {
              i = keyLastIndex++;
              keys[i] = k;
            }
          }
          dst[i] = base(src[k], path.concat([k]));
        }
      }
    }
    return [RPC_TYPE_OBJECT, index];
  }

  return [
    base(src, rootId ? ('' + rootId).split('.') : []),
    convertedObjects,
    convertedArrays,
    keys,
  ];
};
