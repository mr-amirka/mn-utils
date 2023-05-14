const runtime = require('../runtime');
const runFrame = require('./runFrame');


module.exports = (fn, fps) => {
  let _stop;
  let _lastTime;
  function pause() {
    if (_stop) {
      _stop();
      _stop = 0;
    }
    return self;
  }

  function frame() {
    const time = runtime();
    const diff = time - _lastTime;
    _lastTime = time;
    fn(diff);
  }
  function play() {
    _lastTime = runtime();
    _stop || (_stop = runFrame(frame, 1000 / fps));
    return self;
  }
  const self = {
    pause,
    play,
    isPlaying: () => !!_stop,
  };
  return self;
};
