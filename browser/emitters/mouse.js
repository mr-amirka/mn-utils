const attachEventEmitable = require('../../attachEventEmitable');


module.exports = {
  mousedown$: attachEventEmitable(window, 'mousedown'),
  mouseup$: attachEventEmitable(window, 'mouseup'),
  mousemove$: attachEventEmitable(window, 'mousemove'),
};
