const CancelablePromise = require('../../CancelablePromise');
const attachEvent = require('../../attachEvent');
const noop = require('../../noop');
const rpcProvider = require('../index');


module.exports = (childWindow, env) => {
  let parent = childWindow.parent;
  return new CancelablePromise((resolve, reject) => {
    let _cancel = noop;
    function terminate() {
      _cancel && (
        _cancel(),
        _cancel = parent = childWindow = env = 0
      );
    }
    resolve(
        rpcProvider({
          env: env || {},
          emit: (data) => {
            childWindow && childWindow.postMessage(data, '*');
          },
          on: (emit) => {
            parent && (_cancel = attachEvent(parent, 'message', (e) => {
              emit(e.data);
            }, false));
          },
        })
            .finally((err, response) => {
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
