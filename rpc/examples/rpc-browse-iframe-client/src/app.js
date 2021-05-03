const rpcIframeClient = require('mn-utils/rpc/iframe/client');
const WIDGET_PAYMENT_URL = './widget.html';

function Payment(node, options) {
  const iframe = document.createElement('iframe');
  const s = iframe.style;
  s.display = 'block';
  s.margin = 'auto';
  s.borderWidth = '0';
  s.borderColor = 'transparent';
  iframe.onload = () => {
    rpcIframeClient(iframe.contentWindow, {
      ...(options || {}),
      onResize: function(size) {
        s.width = '' + size[0] + 'px';
        s.height = '' + size[1] + 'px';
      },
    }).then((instance) => {
      const {
        // terminate,
        // exports,
      } = instance;
      // ...
    });
  };
  iframe.src = WIDGET_PAYMENT_URL;
  node.className = (node.className || '') + ' ToolsName_Widget_Payment';
  node.appendChild(iframe);
}

window.ToolsName = {
  widgets: {
    Payment,
  },
};
