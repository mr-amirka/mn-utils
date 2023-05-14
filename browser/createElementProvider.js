const extend = require('../extend');

module.exports = (doc) => {
  return function(tagName, attrs, parent) {
    const node = extend(doc.createElement(tagName), attrs);
    parent && parent.appendChild(node);
    return node;
  };
};
