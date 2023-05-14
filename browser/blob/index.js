const CancelablePromise = require('../../CancelablePromise');


function blobToProvider(fnName) {
  return function blobToText(blob) {
    return new CancelablePromise((resolve, reject) => {
      let _reader = new FileReader();
      function clear() {
        _reader = _reader.onload = _reader.onerror = null;
      }
      _reader.onload = () => {
        _reader && (
          resolve(_reader.result),
          clear()
        );
      };
      _reader.onerror = (error) => {
        _reader && (
          clear(),
          reject(error)
        );
      };
      _reader[fnName](blob);
      return () => {
        _reader && (
          _reader.abort && _reader.abort(),
          clear()
        );
      };
    });
  };
}

const blobToText = module.exports = blobToProvider('readAsText');
blobToText.from = require('./from');
blobToText.provider = blobToProvider;
blobToText.toText = blobToText;
blobToText.toBase64Url = blobToProvider('readAsDataURL');
blobToText.toArrayBuffer = blobToProvider('readAsArrayBuffer');
