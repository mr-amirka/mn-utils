const noop = require('mn-utils/noop');
const rpcIframeHost = require('mn-utils/rpc/iframe/host');

rpcIframeHost((env) => {
  const {
    param2$,
  } = env;
  console.log({
    env,
    param2: param2$.getValue(),
  });

  param2$.on((param2) => {
    console.log({
      param2,
    });
  });

  const onResize = env.onResize || noop;
  const appNode = document.getElementById('app');

  function applyResize() {
    onResize([
      appNode.offsetWidth || 0,
      appNode.offsetHeight || 0,
    ]);
  }
  window.addEventListener('resize', applyResize);
  applyResize();

  return {};
});
