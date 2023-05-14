const destroyProvider = require('../../destroyProvider');
const forEach = require('../../forEach');

// Директива для рендеринга элемента по некоторому шаблону
module.exports = function({node, options$, scope, destroy}) {
  const commentNode = document.createComment('view');
  const parentNode = node.parentNode;
  parentNode.insertBefore(commentNode, node);
  parentNode.removeChild(node);
  let slot;
  function render(options) {
    const createNode = options.template;
    if (!createNode) return;
    removeSlot();
    const destroy = destroyProvider();
    const childNodes = createNode(scope, destroy), l = childNodes.length; // eslint-disable-line
    let i = 0;
    for (;i < l; i++) parentNode.insertBefore(childNodes[i], commentNode);
    slot = [childNodes, destroy];
  }
  function removeNode(childNode) {
    parentNode.removeChild(childNode);
  }
  function removeSlot() {
    slot && (
      slot[1](),
      forEach(slot[0], removeNode),
      slot = 0
    );
  }
  render(options$.getValue());
  destroy.add(options$.on(render), removeSlot);
};
