const childClass = require('../childClass');
const extend = require('../extend');

/*
const TransformFrom = require('mn-utils/jsonl/ProviderOfTransformTo')({
  Transform: require('stream').Transform,
  jsonStringify: JSON.stringify,
});
*/

module.exports = (env) => {
  const jsonStringify = env.jsonStringify;
  return childClass(env.Transform, (self, _super, options) => {
    options = extend({}, options);
    options.readableObjectMode = false;
    options.writableObjectMode = true;
    options.decodeStrings = false;
    _super(options);
  }, {
    _transform: (item, encoding, done) => {
      try {
        done(null, jsonStringify(item) + '\n');
      } catch (error) {
        return done(error);
      }
    },
    _flush: (done) => {
      done();
    },
  });
};
