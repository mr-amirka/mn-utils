const noop = require('../noop');
const once = require('../once');
const isEmpty = require('../isEmpty');
const CancelablePromise = require('../CancelablePromise');
const stackProvider = require('../stackProvider');
const jsonParse = require('../jsonParse');
const jsonStringify = require('../jsonStringify');
const blobToText = require('./blob');
const wsConnect = require('./wsConnect');

let _lastId = 0;

function defaultGenerateIdempotencyKey() {
  return ++_lastId;
}
function defaultOnReconnect() {
  return CancelablePromise.delay(10000);
}

module.exports = (wsUrl, configs) => {
  configs = configs || {};
  const _reconnect = configs.reconnect;
  const _onMessage = configs.onMessage || noop;
  const _onError = configs.onError || noop;
  const _onReconnect = configs.onReconnect || defaultOnReconnect;
  const _onSuccessConnect = configs.onSuccessConnect || noop;
  const _generateIdempotencyKey = configs.generateIdempotencyKey
    || defaultGenerateIdempotencyKey;
  const stackAfter = stackProvider();
  const stackMain = stackProvider();
  const expectedAfter = expectedResponsesProvider();
  const expectedMain = expectedResponsesProvider();
  // eslint-disable-next-line
  let socket, reconnection, closed, connectionError, cancelConnect = noop;


  function expectedResponsesProvider() {
    let messages = {};
    function send(item) {
      // eslint-disable-next-line
      const args = item[2], id = item[3];
      args && (
        messages[id] = item,
        socket.send(Buffer.from(jsonStringify({
          id,
          method: args[0],
          data: args[1],
        }), 'utf-8'))
      );
    }
    function each(iteratee) {
      let id;
      // eslint-disable-next-line
      for (id in messages) iteratee(messages[id]);
    }
    return {
      each,
      send,
      sendAll: () => {
        each(send);
      },
      apply: (response) => {
        const id = response.id;
        const item = messages[id];
        if (item) {
          delete messages[id];
          item[0](response);
        }
      },
      error: (error) => {
        // eslint-disable-next-line
        let id, msgs = messages;
        messages = {};
        // eslint-disable-next-line
        for (id in msgs) msgs[id][1](error);
      },
      isEmpty: () => {
        return isEmpty(messages);
      },
    };
  }

  function destroy() {
    cancelConnect();
    socket && (
      socket.close(1000, 'Connection closed'),
      socket = socket.onclose = socket.onerror = socket.onmessage
        = socket.onopen = null
    );
  }

  function reconnect(error, lazy) {
    if (closed) {
      return expectedMain.error(error);
    }
    reconnection = 1;
    if (lazy) {
      return connect(onOpen, onError);
    }
    let hasAfterRequest = 0;
    let hasEnd = 0;
    const promises = [];
    CancelablePromise.resolve(_onReconnect(error, (method, data) => {
      const promise = new CancelablePromise((resolve, reject) => {
        if (hasEnd) {
          reject(new Error('The executor has already returned a result'));
          return;
        }
        stackAfter.push([
          resolve,
          reject,
          [method, data],
          _generateIdempotencyKey(),
        ]);
        hasAfterRequest || (
          hasAfterRequest = 1,
          connect(() => {
            stackAfter.eachPop(expectedAfter.send);
          }, () => {
            expectedAfter.error(error);
            stackAfter.eachPop((item) => {
              item[1](error);
            });
            reconnect(error);
          })
        );
      });
      promises.push(promise);
      return promise;
    })).finally((error) => {
      hasEnd = 1;
      if (closed) {
        return;
      }
      if (hasAfterRequest) {
        CancelablePromise.all(promises).finally(() => {
          socket && (
            socket.onclose = socket.onerror = once((error) => {
              destroy();
              onError(error);
              _onError(error);
            }),
            expectedMain.sendAll(),
            onOpen()
          );
        });
        return;
      }
      if (error) {
        expectedMain.error(error);
        reconnection = 0;
        return;
      }
      expectedMain.each(stackMain.push);
      connect(onOpen, onError);
    });
  }
  function onError(error) {
    _reconnect || reconnection || stackMain.has() || !expectedMain.isEmpty()
      ? reconnect(error)
      : (connectionError = error);
  }
  function onOpen() {
    reconnection = 0;
    _onSuccessConnect();
    stackMain.eachPop(expectedMain.send);
  }
  function _onData(response) {
    response = jsonParse(response);
    _onMessage(response) !== false && (
      expectedAfter.apply(response),
      expectedMain.apply(response)
    );
  }
  function onMessage(e) {
    blobToText(e.data)
        .then(_onData)
        .catch(_onError);
  }
  function connect(onConnect, onError) {
    const onCatch = once((error) => {
      destroy();
      onError(error);
      _onError(error);
    });
    cancelConnect = wsConnect(wsUrl).then((_socket) => {
      socket = _socket;
      socket.onmessage = onMessage;
      socket.onclose = socket.onerror = onCatch;
      onConnect();
    }, onCatch).cancel;
  }

  function request(method, data) {
    return new CancelablePromise((resolve, reject) => {
      if (closed) {
        return reject(new Error('Connection is closed'));
      }

      connectionError && (
        reconnect(connectionError, 1),
        connectionError = 0
      );

      const item = [
        resolve,
        reject,
        [method, data],
        _generateIdempotencyKey(),
      ];

      reconnection ? stackMain.push(item) : (
        socket ? expectedMain.send(item) : (
          reconnection = 1,
          stackMain.push(item),
          connect(onOpen, onError)
        )
      );
      return () => {
        item[2] = 0;
      };
    });
  }

  request.close = () => {
    closed = 1,
    destroy();
  };
  request.reset = destroy;

  return request;
};
