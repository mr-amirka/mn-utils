const CancelablePromise = require('../CancelablePromise');
const stackProvider = require('../stackProvider');
const jsonParse = require('../jsonParse');
const jsonStringify = require('../jsonStringify');
const noop = require('../noop');

let _lastId = 0;

function defaultGenerateIdempotencyKey() {
  return ++_lastId;
}

function defaultOnReconnect() {
  return CancelablePromise.delay(10000);
}


module.exports = (wsUrl, configs) => {
  configs = configs || {};
  const _onMessage = configs.onMessage || noop;
  const _onError = configs.onError || noop;
  const _onReconnect = configs.onReconnect || defaultOnReconnect;
  const _onSuccessConnect = configs.onSuccessConnect || noop;
  const _generateIdempotencyKey = configs.generateIdempotencyKey
    || defaultGenerateIdempotencyKey;
  const [getRequest, addRequest] = stackProvider();
  let messages = {}, opened, socket, reconnection; // eslint-disable-line
  function socketApplyBase(item) {
    const args = item[2], id = item[3]; // eslint-disable-line
    if (!args) return;
    messages[id] = item;
    socket.send(Buffer.from(jsonStringify({
      id,
      method: args[0],
      data: args[1],
    }), 'utf-8'));
  }
  function onReconnectFinally(err) {
    reconnection = 0;
    let id, msgs = messages; // eslint-disable-line
    messages = {};
    if (err) {
      for (id in msgs) msgs[id][1](err); // eslint-disable-line
      return;
    }
    connect();
    for (id in msgs) addRequest(msgs[id]); // eslint-disable-line
  }
  function close() {
    socket.close(1000, 'Connection closed');
  }
  function onError(err) {
    _onError(err);
    if (reconnection) return;
    socket && close();
    opened = socket = 0;
    reconnection = 1;
    _onReconnect(err).finally(onReconnectFinally);
  }
  function onOpen() {
    // console.log('Connection is open');
    opened = 1;
    _onSuccessConnect();
    let item;
    while (item = getRequest()) socketApplyBase(item);
  }
  function onMessage(e) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const response = jsonParse(reader.result);
        if (_onMessage(response) === false) return;
        const id = response.id;
        const item = messages[id];
        if (item) {
          delete messages[id];
          item[0](response);
        }
      } catch (ex) {
        _onError(ex);
        // console.error(ex);
      }
    };
    reader.readAsText(e.data);
  }
  function connect() {
    socket = new WebSocket(wsUrl);
    socket.onopen = onOpen;
    socket.onclose = socket.onerror = onError;
    socket.onmessage = onMessage;
  }

  function request(method, data) {
    return new CancelablePromise((resolve, reject) => {
      let item = [
        resolve,
        reject,
        [method, data],
        _generateIdempotencyKey(), // '' + (++lastId) + '_' + getTime(),
      ];
      reconnection ? addRequest(item) : (
        opened ? socketApplyBase(item) : addRequest(item),
        socket || connect()
      );
      return () => {
        item && (item[2] = 0, item = 0);
      };
    });
  }

  request.close = () => {
    socket && (
      close(),
      opened = socket = 0
    );
  };

  return request;
};
