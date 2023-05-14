const {
  open,
  read,
  close,
} = require('fs');
const CancelablePromise = require('../../../CancelablePromise');


const DEFAULT_BUFFER_LENGTH = 1024 * 4;


module.exports = (options) => {
  return new CancelablePromise((resolve, reject) => {
    const {
      path,
    } = options;
    const bufferLength = options.bufferLength || DEFAULT_BUFFER_LENGTH;

    let position = options.position || 0;
    let _fd, _stop;


    function closeBase() {
      if (!_fd) {
        return;
      }
      const fd = _fd;
      _fd = 0;
      close(fd, (error) => {
        error && console.error('readSlice close', error);
      });
    }

    open(path, 'r', (error, fd) => {
      if (error) {
        reject(error);
        return;
      }
      _fd = fd;

      if (_stop) {
        closeBase();
        return;
      }
  
      const buffer = new Buffer(bufferLength);
  
      read(fd, buffer, 0, bufferLength, position, (error, bytesRead) => {
        if (_stop) {
          return;
        }
        error ? reject(error) : resolve({
          buffer: bytesRead > 0
            ? (
              position += bytesRead,
              bytesRead === bufferLength
                ? buffer
                : buffer.slice(0, bytesRead)
            )
            : null,
          position,
        });

        closeBase();
      });
    });
  
    return () => {
      _stop = 1;
      closeBase();
    };
  });
}
