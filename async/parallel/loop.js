const loopMap = require('../../loopMap');
const isLength = require('../../isLength');
const {
  all: cancelablePromiseAll,
} = require('../../CancelablePromise');
const loopAsync = require('../loop');


module.exports = (checkFn, statementFn, taskLimit) => {
  if (!isLength(taskLimit = taskLimit || 1)) {
    throw new Error('The taskLimit must be a number');
  }
  let _executing = 1;
  function _checkFn() {
    return _executing && (_executing = checkFn());
  }
  return cancelablePromiseAll(loopMap(taskLimit, () => {
    return loopAsync(_checkFn, statementFn);
  }));
};
