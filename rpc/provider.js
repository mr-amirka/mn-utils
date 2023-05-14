const CancelablePromise = require('../CancelablePromise');
const slice = require('../slice');
const isPromise = require('../isPromise');
const noop = require('../noop');
const getTime = require('../time');
const __get = require('../get');

const {
  resolve: cancelablePromiseResolve,
} = CancelablePromise;


const RPC_RESULT_HAS_ERROR = 0;
const RPC_RESULT_DATA = 1;
const RPC_RESULT_ERROR = 2;

const RPC_MSG_GET_TASK = 0;
const RPC_MSG_REQUEST = 1;
const RPC_MSG_RESPONSE = 2;
const RPC_MSG_CANCEL = 3;

const RPC_TASK_ARGS = 0;
const RPC_TASK_NEXT = 1;
const RPC_TASK_CANCEL = 2;

const INIT_FN_NAME = 'RPC_CONNECTION_INIT';

let _lastId = 0;

function getUniqTaskId() {
  return `rpc_${++_lastId}_${getTime()}`;
}
function getUniqId() {
  return ++_lastId;
}

module.exports = (options) => {
  const {
    emit,
    encode: rpcEncode,
    decode: rpcDecode,
  } = options;

  const defers = {};
  const fns = {};
  const handlers = [];
  let promises = {}, current, last = []; // eslint-disable-line

  fns[INIT_FN_NAME] = options.init || noop;
  handlers[RPC_MSG_GET_TASK] = start;
  handlers[RPC_MSG_REQUEST] = (taskId, req) => {
    if (!req) {
      return;
    }
    const result = execute(__get(fns, req[0]), req[1]);
    const data = result[RPC_RESULT_DATA];
    (
      promises[taskId] = isPromise(data)
        ? data.then(normalizePromise, errorProvider)
        : cancelablePromiseResolve(result)
    ).then((response) => {
      let encoded;
      try {
        encoded = rpcEncode(response, fns, getUniqId());
      } catch (e) {
        encoded = rpcEncode(errorProvider(e));
      }
      emit([RPC_MSG_RESPONSE, taskId, encoded]);
    }).finally(() => {
      delete promises[taskId];
    });
    emit([RPC_MSG_GET_TASK]);
  };
  handlers[RPC_MSG_RESPONSE] = (taskId, res) => {
    const task = defers[taskId];
    delete defers[taskId];
    const args = task && task[RPC_TASK_ARGS];
    if (args) {
      const error = res
        ? res[RPC_RESULT_HAS_ERROR]
        : new Error(`RPC Task ${taskId}: Invalid response`);
      error
        ? args[2](error)
        : args[1](res[RPC_RESULT_DATA]);
    }
    start();
  };
  handlers[RPC_MSG_CANCEL] = (taskId) => {
    const promise = promises[taskId];
    delete promises[taskId];
    promise.cancel();
  };
  function start() {
    let prev;
    while (prev = current) {
      current = prev[RPC_TASK_NEXT];
      if (prev[RPC_TASK_ARGS]) return __start(prev);
    }
  }
  function __start(task) {
    const args = task[RPC_TASK_ARGS];
    const params = args[0];
    const taskId = getUniqTaskId();
    defers[taskId] = task;
    task[RPC_TASK_CANCEL] = () => {
      if (defers[taskId]) {
        emit([RPC_MSG_CANCEL, taskId]);
        delete defers[taskId];
      }
    };
    emit([
      RPC_MSG_REQUEST,
      taskId,
      rpcEncode(params[1], fns, params[0]), // eslint-disable-line
    ]);
  }
  function invokeBase(slotId, ctx) {
    return new CancelablePromise((resolve, reject) => {
      last = last[RPC_TASK_NEXT] = [
        [[slotId, ctx], resolve, reject],
      ];
      current || (current = last, start());
      return subscriptionWrap(last);
    });
  }
  function invoke(ctx) {
    const slotId = getUniqId();
    return invokeBase(slotId, ctx).finally(() => {
      delete fns[slotId];
    });
  }
  function getFn(fnName) {
    return function() {
      return invoke([fnName, slice(arguments)]); // eslint-disable-line
    };
  }

  options.on((response, handle) => {
    response
      && (handle = handlers[response[0]])
      && rpcDecode(response[2], getFn)
          .then((v) => handle(response[1], v));
  });

  return invokeBase(getUniqId(), [INIT_FN_NAME, [options.env]]);
};

function normalizePromise(data) {
  return [0, data];
}
function errorProvider(error) {
  return [1, null, error];
}
function execute(fn, data) {
  try {
    return [0, fn.apply(null, data)]; // eslint-disable-line
  } catch (ex) {
    return errorProvider(ex);
  }
}
function subscriptionWrap(current) {
  return () => {
    if (current) {
      const cancel = current[RPC_TASK_CANCEL];
      cancel && cancel();
      delete current[RPC_TASK_ARGS];
      current = null;
    }
  };
}
