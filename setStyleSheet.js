
module.exports = (node, text, document) => {
  const styleSheet = node.styleSheet;
  const cs = node.childNodes;
  let ci = cs && cs.length || 0;
  if (styleSheet) {
    styleSheet.cssText = text;
  } else {
    while (--ci > -1) node.removeChild(cs[ci]);
    node.appendChild(document.createTextNode(text));
  }
};
