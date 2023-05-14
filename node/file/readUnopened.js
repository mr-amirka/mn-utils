const childClass = require('../../childClass');
const extend = require('../../extend');
const readSlice = require('./readSlice');

const DEFAULT_BUFFER_LENGTH = 1024 * 4;
const DEFAULT_ADDITIONAL_ATTEMPT_LIMIT = 2;
const DEFAULT_TIMEOUT = 60000;


const ReadUnopened = childClass(require('stream').Readable, (
  self, _super, options,
) => {
  options = extend({}, options);
  const _path = options.path;
  const _bufferLength = options.bufferLength || DEFAULT_BUFFER_LENGTH;
  const _additionaAttemptLimit = options.additionaAttemptLimit || DEFAULT_ADDITIONAL_ATTEMPT_LIMIT;
  const _timeout = options.timeout || DEFAULT_TIMEOUT;

  let _position = 0;
  let _reading;
  let _next;

  delete options.path;
  delete options.bufferLength;
  delete options.additionaAttemptLimit;
  delete options.timeout;

  _super(options);

  function read() {
    readSlice({
      path: _path,
      position: _position,
      bufferLength: _bufferLength,
      timeout: _timeout,
      additionaAttemptLimit: _additionaAttemptLimit,
    }).then(onRead, onCatch);
  }
  function onRead(data) {
    _position = data.position;
    if (_next) {
      _next = false;
      read();
    } else {
      _reading = false;
    }
    
    self.push(data.buffer);
  }
  function onCatch(error) {
    _next = _reading = false;
    console.error('ReadUnopened', error);
    process.exit();
    self.push(null);
  }


  self._read = () => {
    if (_reading) {
      _next = true;
      return;
    }

    _reading = true;
    read();
  };
});

/*
const readableStream = readUnopened('./input.jsonl', {
  bufferLength: 1024 * 8,
});
*/
function readUnopened(path, options) {
  return new ReadUnopened(extend(extend({}, options), {
    path,
  }));
}

readUnopened.ReadUnopened = ReadUnopened;

module.exports = readUnopened;
