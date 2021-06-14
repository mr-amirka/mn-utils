const CancelablePromise = require('../CancelablePromise');
const Emitter = require('../Emitter');
const slice = require('../slice');
const isArray = require('../isArray');
const isPromise = require('../isPromise');
const isEmitter = require('../isEmitter');
const isDate = require('../isDate');
const isRegExp = require('../isRegExp');
const regexpParse = require('./regexpParse');
const noop = require('../noop');
const map = require('../map');
const uniqIdProvider = require('../uniqIdProvider');
const __get = require('../get');


const RPC_RESULT_HAS_ERROR = 0;
const RPC_RESULT_DATA = 1;
const RPC_RESULT_ERROR = 2;

const RPC_TYPE_FUNCTION = 0;
const RPC_TYPE_OBJECT = 1;
const RPC_TYPE_TIME = 2;
const RPC_TYPE_REGEXP = 3; // eslint-disable-line
const RPC_TYPE_EMITTER = 4; // eslint-disable-line
const RPC_TYPE_PROMISE = 5; // eslint-disable-line

const RPC_MSG_INIT = 0;
const RPC_MSG_DONE = 1;
const RPC_MSG_REQUEST = 2;
const RPC_MSG_RESPONSE = 3;
const RPC_MSG_GET_TASK = 4;
const RPC_MSG_CANCEL = 5;

const RPC_TASK_ARGS = 0;
const RPC_TASK_NEXT = 1;
const RPC_TASK_CANCEL = 2;


function rpcProvider(env, init, emit, on) {
  const deal = new CancelablePromise(() => {
    return (k, v) => {
      for (k in promises) (v = promises[k].cancel) && v(); // eslint-disable-line
      promises = {};
    };
  });

  const getTaskId = uniqIdProvider();
  const getFnId = uniqIdProvider();

  const defers = {};
  const fns = {};
  const handlers = [];
  let promises = {};
  let current, last = []; // eslint-disable-line

  function __apply(taskId, fn, params) {
    const result = execute(fn, params);
    const data = result[RPC_RESULT_DATA];
    return isPromise(data)
      ? data.then(normalizePromise, errorProvider)
      : CancelablePromise.resolve(result);
  }
  handlers[RPC_MSG_DONE] = (taskId, response) => {
    response && (
      response[RPC_RESULT_HAS_ERROR]
        ? deal.reject(response[RPC_RESULT_ERROR])
        : deal.resolve(response[RPC_RESULT_DATA])
    );
  };
  handlers[RPC_MSG_INIT] = (taskId, env) => {
    (promises[taskId] = __apply(taskId, init || noop, env)
        .then((response) => {
          return [RPC_MSG_DONE, [taskId, rpcEncode(response, fns, getFnId())]];
        })
    ).then(emit).finally(() => {
      delete promises[taskId];
    });
  };
  handlers[RPC_MSG_REQUEST] = (taskId, req) => {
    if (req) {
      (promises[taskId] = __apply(taskId, __get(fns, req[0]), req[1])
          .then((response) => [RPC_MSG_RESPONSE, [taskId, rpcEncode(response)]])
      ).then(emit).finally(() => {
        delete promises[taskId];
      });
      emit([RPC_MSG_GET_TASK]);
    }
  };
  handlers[RPC_MSG_RESPONSE] = (taskId, res) => {
    start();
    const task = defers[taskId];
    delete defers[taskId];
    const args = task && task[RPC_TASK_ARGS];
    args && (
      res[RPC_RESULT_HAS_ERROR]
        ? args[2](res[RPC_RESULT_ERROR])
        : args[1](res[RPC_RESULT_DATA])
    );
  };
  handlers[RPC_MSG_GET_TASK] = start;
  handlers[RPC_MSG_CANCEL] = (taskId) => {
    const promise = promises[taskId];
    const cancel = promise && promise.cancel;
    delete promises[taskId];
    cancel && cancel();
  };
  function start() {
    let args, prev; // eslint-disable-line
    while (prev = current) {
      current = prev[RPC_TASK_NEXT];
      if (args = prev[RPC_TASK_ARGS]) return __start(prev);
    }
  }
  function __start(task) {
    const taskId = getTaskId();
    const args = task[RPC_TASK_ARGS];
    defers[taskId] = task;
    task[RPC_TASK_CANCEL] = () => {
      if (defers[taskId]) {
        emit([RPC_MSG_CANCEL, [taskId]]);
        delete defers[taskId];
      }
    };
    emit([RPC_MSG_REQUEST, [taskId, args[0]]]);
  }
  function invoke(ctx) {
    const slotId = getFnId();
    return new CancelablePromise((resolve, reject) => {
      last = last[RPC_TASK_NEXT] = [
        [rpcEncode(ctx, fns, slotId), resolve, reject],
      ];
      current || (current = last, start());
      return subscriptionWrap(last);
    }).finally((err, response) => {
      delete fns[slotId];
    });
  }
  function getFn(fnName) {
    return function() {
      return invoke([fnName, slice(arguments)]); // eslint-disable-line
    };
  }

  on((response) => {
    if (!response) return;
    const options = response[1] || [];
    const taskId = options[0];
    const promise = promises[taskId];
    if (promise) return promise;
    const handle = handlers[response[0]];
    handle && rpcDecode(options[1], getFn)
        .then((v) => handle(taskId, v));
  });

  env && emit([RPC_MSG_INIT, [getTaskId(), rpcEncode([env], fns, getFnId())]]);
  return deal;
}
function adaptEmitter(input$) {
  const {
    on,
  } = input$;
  const output$ = map(input$);
  output$.on = (v) => {
    return new CancelablePromise(() => {
      return on(v);
    });
  };
  return output$;
}
function rpcEncode(src, scope, name) {
  function withFn(src, scope, name, prefix) {
    if (!src) return src;
    const type = typeof src;
    if (type === 'function') {
      scope[name] = src;
      return [RPC_TYPE_FUNCTION, prefix + name];
    }
    if (type === 'object') {
      if (isDate(src)) return [RPC_TYPE_TIME, src.toISOString()];
      if (isRegExp(src)) return [RPC_TYPE_REGEXP, src.toString()];
      if (isEmitter(src)) src = adaptEmitter(src);
      prefix += name + '.';
      scope = scope[name] = {};
      let k, dst, length; // eslint-disable-line
      if (isArray(src)) {
        dst = new Array(length = src.length);
        for (k = 0; k < length; k++) dst[k] = withFn(src[k], scope, k, prefix);
      } else {
        dst = {};
        // eslint-disable-next-line
        for (k in src) dst[k] = withFn(src[k], scope, k, prefix);
      }
      return [RPC_TYPE_OBJECT, dst];
    }
    return src;
  }
  function base(src, type) {
    return src
      ? (
        type = typeof src,
        type === 'function'
          ? null
          : (
            type === 'object'
              ? (
                isRegExp(src)
                  ? [RPC_TYPE_REGEXP, src.toString()]
                  : (
                    isDate(src)
                      ? [RPC_TYPE_TIME, src.toISOString()]
                      : [
                        RPC_TYPE_OBJECT,
                        map(isEmitter(src) ? adaptEmitter(src) : src, base),
                      ]
                  )
              )
              : src
          )
      )
      : src;
  }
  return scope ? withFn(src, scope, name, '') : base(src);
}
function rpcDecode(value, getFn) {
  const promies = [];
  getFn = getFn || noop;
  function unpack(v) {
    if (!isArray(v)) return v;
    let type = v[0], value = v[1], matchs; // eslint-disable-line
    if (type === RPC_TYPE_FUNCTION) return getFn(value);
    if (type === RPC_TYPE_TIME) return new Date(value);
    if (type === RPC_TYPE_REGEXP) {
      matchs = regexpParse(value);
      return new RegExp(matchs[1], matchs[2]);
    }

    value = map(value, unpack);

    if (isEmitter(value)) {
      const emitter$ = new Emitter();
      const {
        emit,
      } = emitter$;
      value.on(emit);
      promies.push(value.getValue().then(emit));
      return emitter$.map();
    }

    return value;
  }
  const output = unpack(value);
  return CancelablePromise.all(promies)
      .then(() => output);
}

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

module.exports = {
  RPC_RESULT_HAS_ERROR,
  RPC_RESULT_DATA,
  RPC_RESULT_ERROR,

  RPC_TYPE_FUNCTION,
  RPC_TYPE_TIME,
  RPC_TYPE_PROMISE,
  RPC_TYPE_EMITTER,
  RPC_TYPE_REGEXP,
  RPC_RESULT_ERROR,

  RPC_MSG_INIT,
  RPC_MSG_DONE,
  RPC_MSG_REQUEST,
  RPC_MSG_RESPONSE,
  RPC_MSG_GET_TASK,
  RPC_MSG_CANCEL,

  RPC_TASK_ARGS,
  RPC_TASK_NEXT,
  RPC_TASK_CANCEL,

  rpcProvider,
  rpcEncode,
  rpcDecode,
};
