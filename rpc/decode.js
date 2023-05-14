const CancelablePromise = require('../CancelablePromise');
const Observable = require('../Observable');
const noop = require('../noop');
const map = require('../map');
const isArray = require('../isArray');
const isObservable = require('../isObservable');
const regexpParse = require('../regexpParse');

const {
  RPC_TYPE_FUNCTION,
  RPC_TYPE_ARRAY,
  RPC_TYPE_TIME,
  RPC_TYPE_REGEXP,
} = require('./constants');

const {
  all: cancelablePromiseAll,
} = CancelablePromise;


function decodeObservable(input$) {
  return new Observable((emit) => {
    return input$.on(emit).cancel;
  });
}


module.exports = (input, getFn) => {
  getFn = getFn || noop;
  return new CancelablePromise((resolve) => {
    const convertedObjects = input[1];
    const convertedArrays = input[2];
    const keys = input[3];

    const unpackedObjects = [];
    const unpackedArrays = [];

    const promises = [];
    function unpack(v) {
      if (!isArray(v)) {
        return v;
      }
      let type = v[0], value = v[1], matchs; // eslint-disable-line
      if (type === RPC_TYPE_FUNCTION) {
        return getFn(value);
      }
      if (type === RPC_TYPE_TIME) {
        return new Date(value);
      }
      if (type === RPC_TYPE_REGEXP) {
        matchs = regexpParse(value);
        return new RegExp(matchs[1], matchs[2]);
      }
      if (type === RPC_TYPE_ARRAY) {
        return unpackedArrays[value]
          || map(convertedArrays[value], unpack, unpackedArrays[value] = []);
      }
      let k, dst; // eslint-disable-line
      if (dst = unpackedObjects[value]) {
        return dst;
      }
      value = convertedObjects[value];

      dst = unpackedObjects[value] = {};

      if (keys) {
        for (k in value) { // eslint-disable-line
          dst[keys[k] || k] = unpack(value[k]);
        }
      } else {
        for (k in value) { // eslint-disable-line
          dst[k] = unpack(value[k]);
        }
      }

      if (isObservable(dst)) {
        const emitter$ = decodeObservable(dst);
        promises.push(dst.getValue().then(emitter$.emit));
        return emitter$.map();
      }
      return dst;
    }
    const output = unpack(input[0]);
    resolve(
        cancelablePromiseAll(promises)
            .then(() => output),
    );
  });
};
