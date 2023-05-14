const childClass = require('../childClass');
const extend = require('../extend');

/*
const TransformFrom = require('mn-utils/jsonl/ProviderOfTransformFrom')({
  Transform: require('stream').Transform,
  StringDecoder: require('string_decoder').StringDecoder,
  jsonParse: JSON.parse,
});
*/

module.exports = (env) => {
  const StringDecoder = env.StringDecoder;
  const jsonParse = env.jsonParse;
  return childClass(env.Transform, (self, _super, options) => {
    options = extend({}, options);
    options.readableObjectMode = true;
    options.writableObjectMode = false;
    options.decodeStrings = false;
    _super(options);

    const _decoder = new StringDecoder('utf8');
    let _lineCount = 0;
    let _prev;

    function getLineError(error) {
      return new Error(`Parse error on line ${_lineCount
      }:\n${error.toString()}`);
    }

    self._transform = (chunk, encoding, done) => {
      chunk = _decoder.write(chunk);
      // eslint-disable-next-line
      let length = chunk.length, start = 0, i = start, current;
      for (; i < length; i++) {
        if (chunk[i] === '\n') {
          current = chunk.slice(start, i);
          if (chunk[i + 1] === '\r') {
            i++;
          }
          start = i + 1;
          if (_prev) {
            current = _prev + current;
            _prev = 0;
          }
          _lineCount++;
          try {
            current = jsonParse(current);
          } catch (error) {
            console.error('ProviderOfTransformFrom jsonParse', error);
            done(getLineError(error));
            return;
            // self.destroy(getLineError(error));
          }
          self.push(current);
          continue;
        }
      }
      if (current = chunk.slice(start, length)) {
        _prev = _prev
          ? _prev + current
          : current;
      }
      done();
    };
    self._flush = (done) => {
      try {
        _prev && self.push(jsonParse(_prev));
      } catch (error) {
        return done(getLineError(error));
        // return self.destroy(getLineError(error));
      }
      done();
    };
  });
};
