const delay = require('../../../delay');
const CancelablePromise = require('../../../CancelablePromise');
const readSliceBase = require('./base');

const READ_TIMEOUT = 60000;


module.exports = (options) => {
  return new CancelablePromise((resolve, reject) => {
    const readTimeout = options.timeout || READ_TIMEOUT;
    const additionaAttemptLimit = options.additionaAttemptLimit || 0;
    let _attemptIndex = 0, _cancelTimeout, _cancelRead;

    function onThen(data) {
      _cancelTimeout();
      resolve(data);
    }
    function onCatch(error) {
      _cancelTimeout();
      reject(error);
    }
    function onTimeout() {
      _cancelRead();
      const error = new Error(`File read timed out: ${options.path} on position ${options.position || 0}`);
      if (_attemptIndex < additionaAttemptLimit) {
        console.error(error, {
          attempt: _attemptIndex,
        });
        _attemptIndex++;
        return base();
      }
      reject(error);
    }

    function base() {
      _cancelTimeout = delay(onTimeout, readTimeout);
      _cancelRead = readSliceBase(options).then(onThen, onCatch).cancel;
    }

    base();

    return () => {
      _cancelTimeout();
      _cancelRead();
    };
  });
}
