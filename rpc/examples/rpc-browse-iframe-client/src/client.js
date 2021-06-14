const rpcIframeClient = require('mn-utils/rpc/iframe/client');
const CancelablePromise = require('mn-utils/CancelablePromise');
const Emitter = require('mn-utils/Emitter');

function insertWidget(node, url, options) {
  return new CancelablePromise((resolve) => {
    const iframe = document.createElement('iframe');
    const s = iframe.style;
    s.display = 'block';
    s.margin = 'auto';
    s.borderWidth = '0';
    s.borderColor = 'transparent';
    iframe.onload = () => {
      resolve(rpcIframeClient(iframe.contentWindow, {
        ...(options || {}),
        onResize: function(size) {
          s.width = '' + size[0] + 'px';
          s.height = '' + size[1] + 'px';
        },
      }));
    };
    iframe.src = url;
    node.appendChild(iframe);
    return () => {
      iframe.onload = null;
      node.removeChild(iframe);
    };
  });
}


const emitter = new Emitter(32);

setTimeout(() => {
  emitter.emit(780);
}, 2000);

insertWidget(document.body, './host.html', {
  paramName: 'paramValue',
  param1: /^(t+)$/gim,
  param2$: emitter,
  param3: new Date('2019-03-22'),
}).then((instance) => {
  console.log(instance);
});
