
module.exports = require('../../jsonl/ProviderOfTransformTo')({
  Transform: require('stream').Transform,
  jsonStringify: JSON.stringify,
});
