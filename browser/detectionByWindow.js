const addOf = require('../addOf');
const isDefined = require('../isDefined');
const detection = require('./detection');
const {
  intval,
} = require('../anyval');

module.exports = (window, output) => {
  output = output || [];
  isDefined(window.orientation) && addOf(output, 'orientation');
  const navigator = window.navigator || {};
  intval(navigator.maxTouchPoints) > 1 && addOf(output, 'multitouch');
  return detection(navigator.userAgent || '', output);
};
