const CancelablePromise = require('../CancelablePromise');
const {
  resolve: cancelablePromiseResolve,
  reject: cancelablePromiseReject,
} = CancelablePromise;
const DEFAULT_LIMIT = 100;


module.exports = (stream, limit) => {
  limit = limit || DEFAULT_LIMIT;
  let _hasEnd;
  let _hasError;
  let _error;

  stream.on('end', () => {
    _hasEnd = 1;
  });
  stream.on('error', (error) => {
    // console.error('error');
    _hasEnd = 1;
    _hasError = 1;
    _error = error;
  });

  function next() {
    if (_hasError) {
      return cancelablePromiseReject(_error);
    }
    if (_hasEnd) {
      return cancelablePromiseResolve([]);
    }
    return new CancelablePromise((resolve, reject) => {
      stream.once('readable', () => {
        const items = [];
        let item;
        let i = 0;
        try {
          while (i < limit && (item = stream.read()) !== null) {
            items.push(item);
            i++;
          }
        } catch (e) {
          console.error(e);
          reject(e);
        }
        return resolve(items);
      });
    });
  }
  next.cancel = () => {
    stream.destroy();
  };

  return next;
};
