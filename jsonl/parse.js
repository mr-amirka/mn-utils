function StringDecoder() {}
StringDecoder.prototype.write = require('../noopHandle');

const TransformFrom = require('./ProviderOfTransformFrom')({
  jsonParse: require('../json/parse'),
  Transform: function() {},
  StringDecoder: StringDecoder,
});

function done(error) {
  if (error) {
    throw error;
  }
}

module.exports = (input) => {
  input = '' + input;
  const output = [];
  const transform = new TransformFrom();
  transform.push = (v) => {
    output.push(v);
  };
  transform._transform(input, 0, done);
  transform._flush(done);
  return output;
};
