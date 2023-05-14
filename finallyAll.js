const noop = require('./noop');

module.exports = (fn, callback) => {
  let _count = 0;
  fn(() => {
    _count++;
  }, callback ? () => {
    --_count || callback();
  } : noop);
};
