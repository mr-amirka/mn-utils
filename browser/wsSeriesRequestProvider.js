const noop = require('../noop');
const once = require('../once');
const CancelablePromise = require('../CancelablePromise');
const stackProvider = require('../stackProvider');
const jsonParse = require('../jsonParse');
const jsonStringify = require('../jsonStringify');
const blobToText = require('./blob');
const wsConnect = require('./wsConnect');

function defaultOnReconnect() {
  return CancelablePromise.delay(10000);
}

module.exports = (wsUrl) => {
  configs = configs || {};
  const _onError = configs.onError || noop;
  const _onMessage = configs.onMessage || noop;
  const _onReconnect = configs.onReconnect || defaultOnReconnect;
  let reconnection, socket, cancelConnect = noop; // eslint-disable-line
  const requests = stackProvider();
  const responses = stackProvider();
  function socketApplyBase(item, args) {
    item && (args = item[2]) && (
      responses.push(item),
      socket.send(Buffer.from(jsonStringify({
        method: args[0],
        data: args[1],
      }), 'utf-8'))
    );
  }
  function destroy() {
    cancelConnect();
    socket && (
      socket.close(1000, 'Connection closed'),
      socket = socket.onclose = socket.onerror = socket.onmessage
        = socket.onopen = null
    );
  }
  function connect() {
    if (reconnection) return;
    reconnection = 1;
    const onCatch = once((error, item) => {
      destroy();
      CancelablePromise.resolve(_onReconnect()).then(() => {
        reconnection = 0;
        connect();
      });
      (item = responses.pop()) && item[1](error);
      _onError(error);
    });
    cancelConnect = wsConnect(wsUrl).then((_socket) => {
      socket = _socket;
      socket.onmessage = onMessage;
      socket.onclose = socket.onerror = onCatch;
      reconnection = 0;
      socketApplyBase(requests.pop());
    }, onCatch).cancel;
  }
  function _onData(response, item) {
    response = jsonParse(response);
    _onMessage(response) !== false
      && (item = responses.pop())
      && item[0](response);
  }
  function onMessage(e) {
    blobToText(e.data)
        .then(_onData)
        .catch(_onError);
    socketApplyBase(requests.pop());
  }

  return (method, data) => {
    return new CancelablePromise((resolve, reject) => {
      const item = [
        resolve,
        reject,
        [method, data],
      ];
      socket
        ? socketApplyBase(item)
        : (
          requests.push(item),
          connect()
        );
      return () => {
        item[2] = 0;
      };
    });
  };
};
