const rpcProvider = require('../index');
const attachEvent = require('../../attachEvent');
const CancelablePromise = require('../../CancelablePromise');

module.exports = (init) => {
  let parent = window.parent; // eslint-disable-line
  if (!parent) {
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
            parent && parent.postMessage(data, '*');
          },
          on: (emit) => {
            attachEvent(window, 'message', (e) => {
              emit(e.data);
            }, false);
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
