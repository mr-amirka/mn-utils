const map = require('../map');

module.exports = (html, compile, document) => {
  const box = document.createElement('div');
  box.innerHTML = html.replace(/^\s+|\s+$/, '');
  const patternNodes = box.childNodes;
  return function(scope, destroy, parentNode) {
    return map(patternNodes, (patternNode) => {
      const node = patternNode.cloneNode
        ? patternNode.cloneNode(true)
        : document.createTextNode('');
      parentNode && parentNode.appendChild(node);
      compile(node, scope, destroy);
      return node;
    }, []);
  };
};
