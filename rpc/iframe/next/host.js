const noop = require('../../../noop');
const attachEvent = require('../../../attachEvent');
const CancelablePromise = require('../../../CancelablePromise');
const rpcProvider = require('../../index');


module.exports = (childWindow, init) => {
  if (!childWindow.parent) {
    return CancelablePromise.reject(new Error('Empty window parent'));
  }
  return new CancelablePromise((resolve, reject) => {
    let _cancel = noop;
    function terminate() {
      _cancel && (
        _cancel(),
        _cancel = childWindow = env = 0
      );
    }

    resolve(
        rpcProvider({
          init,
          emit: (data) => {
            childWindow && childWindow.postMessage(data, '*');
          },
          on: (emit) => {
            childWindow
              && (_cancel = attachEvent(childWindow.parent, 'message', (e) => {
                emit(e.data);
              }, false));
          },
        })
            .finally((err) => {
              err && terminate();
            })
            .then((exports) => ({
              terminate,
              exports,
            })),
    );
    return terminate;
  });
};
