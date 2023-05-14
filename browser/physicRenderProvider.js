const getTime = require('../time');
const interval = require('../async/interval');


module.exports = (fn, timestep, runner) => {
  runner = runner || interval;
  let _stop;
  let _lastTime;
  let _balance = 0;
  function pause() {
    if (_stop) {
      _stop();
      _stop = 0;
    }
    return self;
  }
  function handle() {
    const currentTime = getTime();
    const difference = currentTime - _lastTime;
    _lastTime = currentTime;
    _balance += difference;
    for (;_balance > timestep; _balance -= difference) fn(timestep);
  }
  function play() {
    _lastTime = getTime();
    _stop || (_stop = interval(handle, timestep));
    return self;
  }
  const self = {
    pause,
    play,
    isPlaying: () => !!_stop,
  };
  return self;
};
