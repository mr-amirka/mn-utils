const CancelablePromise = require('../CancelablePromise');
const Observable = require('../Observable');
const encode = require('./encode');
const decode = require('./decode');

const fns = {};

let _lastId = 0;
function getUniqId() {
  return ++_lastId;
}
function getFn(fnId) {
  return function() {
    console.log(fnId, arguments); // eslint-disable-line
    return CancelablePromise.resolve(0);
  };
}

const observable$ = new Observable(22);

const originData = {
  observable$,
  user: {
    getName() {
      return 'Vasya';
    },
    age: 10,
    childs: ['ds', 'fshgfd'],
  },
};
const encodedData = encode(originData, fns, getUniqId());
decode(encodedData, getFn).finally((error, decodedData) => {
  console.log({
    error,
    originData,
    encodedData,
    decodedData,
    fns,
    observableValue: decodedData.observable$.getValue(),
  });
});
