const once = require('../once');
const defer = require('../defer');
const urlExtend = require('../urlExtend');
const CancelablePromise = require('../CancelablePromise');

function script(url, options) {
  return base(urlExtend(url, options).href);
}
function base(url) {
  return new CancelablePromise((resolve, reject) => {
    const instance = document.createElement('script');
    const head = document.getElementsByTagName('head')[0];
    const execute = instance.onload = once(() => {
      defer(remove);
      resolve();
    });
    const remove = once(() => {
      const parentNode = instance.parentNode;
      parentNode && parentNode.removeChild(instance);
    });
    instance.onreadystatechange = () => {
      /complete|loaded/.test(instance.readyState) && execute();
    };
    instance.type = 'text/javascript';
    instance.charset = 'utf-8';
    instance.async = true;
    instance.src = url;
    head.appendChild(instance);
    return () => {
      remove();
      instance.abort && instance.abort();
    };
  });
}
script.base = base;
module.exports = script;
