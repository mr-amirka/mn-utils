const time = require('../time');
const requestAnimationFrame = require('./requestAnimationFrame');

module.exports = (callback, interval) => {
  interval = interval || 0;
  let _stop, _balance = 0, _lastTime = time(); // eslint-disable-line
  function step() {
    if (_stop) return;
    const _time = time();
    _balance += _time - _lastTime;
    _lastTime = _time;
    if (_balance >= interval) {
      callback(_balance);
      _balance = 0;
    }
    requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
  return () => {
    _stop = true;
  };
};
