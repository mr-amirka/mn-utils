const noop = require('../../../noop');
const attachEvent = require('../../../attachEvent');
const CancelablePromise = require('../../../CancelablePromise');
const rpcProvider = require('../../index');


module.exports = (env) => {
  let parent = window.parent;
  return new CancelablePromise((resolve, reject) => {
    let _cancel = noop;
    function terminate() {
      _cancel && (
        _cancel(),
        _cancel = parent = env = 0
      );
    }

    resolve(
        rpcProvider({
          env: env || {},
          emit: (data) => {
            parent && parent.postMessage(data, '*');
          },
          on: (emit) => {
            parent && (_cancel = attachEvent(window, 'message', (e) => {
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
