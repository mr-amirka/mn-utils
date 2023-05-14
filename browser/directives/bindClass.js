const extendStringByFlags = require('../../extendStringByFlags');

// Директива позволяет манипулировать атрибутом 'class' dom узла
module.exports = function(ctx) {
  const {node, options$} = ctx;
  function render(options) {
    node.className = extendStringByFlags(node.className, options);
  }
  render(options$.getValue());
  ctx.destroy.add(options$.on(render));
};
