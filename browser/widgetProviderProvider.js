/**
 * @overview widgetProviderProvider
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 * @example


const widgetProvider = widgetProviderProvider({
  url: 'https://api.minimalist-notation.org/auth.html',
  allow: [
    'fullscreen',
  ],
  init(self) {
    extend(self.iframe.style, {
      display: 'block',
      borderWidth: '0',
      borderColor: 'transparent',
      margin: 'auto',
      position: 'fixed',
      padding: 0,
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
      zIndex: 999999,
    });
    return {
      exports: {

      },
      onLoad(module) {

      },
      onDestroy() {

      },
    };
  },
});

const widget = widgetProvider(node, options);

widget.remove();
*/

const noop = require('../noop');
const extend = require('../extend');
const param = require('../param');
const isPromise = require('../isPromise');


module.exports = (configs) => {
  const {
    url,
  } = configs;
  const allow = (configs.allow || []).join('; ');
  const init = configs.init || noop;


  return (node, options) => {
    options = options || {};
    function onRemove() {
      iframe.parentNode.removeChild(iframe);
      rootNode.parentNode.removeChild(rootNode);
      iframe = rootNode = 0;
    }
    function remove() {
      if (_removed) {
        return;
      }
      _removed = 1;
      unmount(onRemove);
    }
    function unmount(callback) {
      const promise = _onUnmount();
      callback && (
        isPromise(promise)
          ? promise.then(callback)
          : callback()
      );
    }
    function onInit(instance) {
      _removed || require('../rpc/iframe/next/host')(iframe.contentWindow, (client) => {
        unmount(() => {
          _onUnmount = (instance.onMount || noop)(client) || noop;
        });
        return {
          options: options,
          exports: instance.exports,
        };
      });
    }

    let _removed;
    let _onUnmount = noop;
    let rootNode = document.createElement('div');
    let iframe = document.createElement('iframe');
    const params = options.params = extend({}, options.params);

    const self = {
      remove,
      rootNode,
      iframe,
      options,
    };
    const instance = init(self);

    params.t = (new Date()).getTime();

    extend(iframe, {
      allow: allow,
      src: url + '?' + param(params),
    });
    rootNode.appendChild(iframe);
    node.appendChild(rootNode);
    node = 0;

    isPromise(instance)
      ? instance.then(onInit)
      : onInit(instance);

    return self;
  };
};
