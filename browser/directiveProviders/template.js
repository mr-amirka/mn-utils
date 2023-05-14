// Директива для добавления шаблона
module.exports = function(templatesInline$, document) {
  return function({node, options$}) {
    templatesInline$.set({
      [options$.getValue()]: node.innerText || node.text || '',
    });
  };
};
