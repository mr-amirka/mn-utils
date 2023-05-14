const setStyleSheet = require('./setStyleSheet');

module.exports = (doc, prefix) => {
  function getNode(id) {
    let node = doc.getElementById(id);
    node || (
      head.appendChild(node = doc.createElement('style')),
      node.setAttribute('id', id)
    );
    return node;
  }
  let last = {}, head; // eslint-disable-line
  return (styles) => {
    head = head || doc.head;
    if (!head) return;
    let trash = last, slot, node, item, revision, name, parentNode, l = styles.length, i = 0; // eslint-disable-line
    last = {};
    while (i < l) {
      item = styles[i++];
      name = item.name;
      revision = item.revision;
      slot = last[name] = trash[name] || [getNode(prefix + name), 0];
      delete trash[name];
      node = slot[0];
      revision === slot[1] || (
        slot[1] = revision,
        setStyleSheet(node, item.content || '', doc)
      );
      head.appendChild(node);
    }
    for (name in trash) { // eslint-disable-line
      (parentNode = (node = trash[name][0]).parentNode)
        && parentNode.removeChild(node);
    }
  };
};
