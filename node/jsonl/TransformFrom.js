
module.exports = require('../../jsonl/ProviderOfTransformFrom')({
  Transform: require('stream').Transform,
  StringDecoder: require('string_decoder').StringDecoder,
  jsonParse: JSON.parse,
});
