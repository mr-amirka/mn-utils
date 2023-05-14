const destroyProvider = require('../../destroyProvider');

// Директива для вывода списка
module.exports = function(ctx) {
  const {node: rootNode, options$, scope} = ctx;
  let indexes_by_id = {}, slots_by_index = {}; // eslint-disable-line
  function removeUnnecessary() {
    let k, slot; // eslint-disable-line
    for (k in slots_by_index) { // eslint-disable-line
      slot = slots_by_index[k];
      slot[1]();
      forEach(slot[0], removeNode);
    }
  }
  function removeNode(childNode) {
    rootNode.removeChild(childNode);
  }
  function render(options) {
    const createNode = options.template;
    if (!createNode) return;
    let // eslint-disable-line
      new_indexes_by_id = {}, // eslint-disable-line
      new_slots_by_index = {}, // eslint-disable-line
      item, destroy, slot, id, changed_index, node, childNode, // eslint-disable-line
      index = 0, items = options.items, length = items && items.length || 0; // eslint-disable-line
    for (;index < length; index++) {
      item = items[index];
      slot = null;
      if (id = item.id) {
        slot = slots_by_index[changed_index = indexes_by_id[id]]; // eslint-disable-line
        delete slots_by_index[changed_index];
        delete indexes_by_id[id];
      }
      if (slot) {
        node = slot[0];
        childNode = rootNode.childNodes[index];
        childNode === node || (
          childNode
            ? rootNode.insertBefore(node, childNode)
            : rootNode.appendChild(node)
        );
      } else {
        destroy = destroyProvider();
        slot = [createNode({
          item: item,
          parent: scope,
        }, destroy, rootNode), destroy];
      }
      if (id) new_indexes_by_id[id] = index;
      new_slots_by_index[index] = slot;
    }
    removeUnnecessary();
    indexes_by_id = new_indexes_by_id; // eslint-disable-line
    slots_by_index = new_slots_by_index; // eslint-disable-line
  }
  render(options$.getValue());
  ctx.destroy.add(options$.on(render), removeUnnecessary);
};
