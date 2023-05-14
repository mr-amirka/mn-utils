const isDefined = require('../../isDefined');
// Директива позволяет манипулировать свойствами dom узла
module.exports = function(ctx) {
  const {options$} = ctx;
  const s = ctx.node.style;
  function render(options) {
    let k, v; // eslint-disable-line
    for (k in options) isDefined(v = options[k]) && (s[k] = v); // eslint-disable-line
  }
  render(options$.getValue());
  ctx.destroy.add(options$.on(render));
};
