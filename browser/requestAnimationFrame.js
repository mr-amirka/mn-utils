const g = window;

module.exports = g.requestAnimationFrame
  || g.mozRequestAnimationFrame
  || g.webkitRequestAnimationFrame
  || g.msRequestAnimationFrame
  || ((fn) => {
    setTimeout(fn, 0);
  });
