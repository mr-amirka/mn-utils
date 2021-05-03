const noop = require('mn-utils/noop');
const rpcIframeHost = require('mn-utils/rpc/iframe/host');

rpcIframeHost((env) => {
  const onResize = env.onResize || noop;
  const widgetInnerNode = document.getElementById('widgetInner');

  function applyResize() {
    const w = widgetInnerNode.offsetWidth || 0;
    const h = widgetInnerNode.offsetHeight || 0;
    const size = [w, h];
    onResize(size);
  }
  window.addEventListener('resize', applyResize);
  applyResize();

  return {};
});
