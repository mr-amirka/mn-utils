
const interval = require('../async/interval');

module.exports = (fn, timestep, speed) => {
  let _stop;
  const pause = () => {
    if (_stop) {
      _stop();
      _stop = null;
    }
    return self;
  };
  const play = () => {
    _stop || (_stop = interval(() => {
      const iterationsLength = self.speed;
      for (let i = 0; i < iterationsLength; i++) fn();
    }, self.timestep));
    return self;
  };
  const self = {
    speed: speed || 1,
    timestep: timestep || 10,
    update: () => {
      pause();
      return play();
    },
    pause,
    play,
    isPlaying: () => !!_stop,
  };
  return self;
};
