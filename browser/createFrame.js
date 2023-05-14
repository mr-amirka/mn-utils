/**
 * @overview widgetProviderProvider
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 * @example


createFrame({
  src: 'https://api.minimalist-notation.org/auth.html',
  allow: 'fullscreen',
}).then((iframe) => {
  iframe.parentNode.removeChild(iframe);
});
*/

const CancelablePromise = require('../CancelablePromise');
const extend = require('../extend');


module.exports = (node, options) => {
  options = extend({}, options);
  return new CancelablePromise((resolve) => {
    const iframe = document.createElement('iframe');
    const onLoad = options.onload;
    delete options.onload;

    iframe.onload = function() {
      // eslint-disable-next-line
      onLoad && onLoad.apply(iframe, arguments);
      resolve(iframe);
    };
    extend(iframe, options);
    node.appendChild(iframe);
    return () => {
      const parentNode = iframe.parentNode;
      parentNode && parentNode.removeChild(iframe);
    };
  });
};
