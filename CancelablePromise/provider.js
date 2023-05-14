const create = require('../create');
const delayFn = require('../delay');
const defer = require('../defer');
const once = require('../once');
const noop = require('../noop');
const extend = require('../extend');
const eachApply = require('../eachApply');
const executeTry = require('../executeTry');
const isObject = require('../isObject');
const isFunction = require('../isFunction');
const isPromise = require('../isPromise');
const isArray = require('../isArray');
const forEach = require('../forEach');
const entries = require('../entries');
const getValues = require('../values');
const mapEach = require('../mapEach');
const slice = require('../slice');
const cancelableThen = require('../cancelableThen');
const getter = require('../get/getter');


module.exports = function(ctx) {
  ctx = ctx || {};
  const deferApply = ctx.defer || defer;
  const ParentClass = ctx.ParentClass;

  function provide(executor) {
    return new CancelablePromise(executor);
  }
  function thenCall(_then, onResolve, onReject, onCancel) {
    if (onCancel && !isFunction(onCancel)) {
      throw new Error('onCancel param must be a function');
    }

    onResolve = getter(onResolve);
    if (onResolve && !isFunction(onResolve)) {
      throw new Error('onResolve param must be a function');
    }

    onReject = getter(onReject);
    if (onReject && !isFunction(onReject)) {
      throw new Error('onReject param must be a function');
    }

    return provide((__resolve, __reject) => {
      const cancel = _then(
        onResolve ? (subject) => {
          try {
            onResolve && __resolve(onResolve(subject));
          } catch (ex) {
            __reject(ex);
          }
        } : __resolve,
        onReject ? (error) => {
          try {
            onReject && __resolve(onReject(error));
          } catch (ex) {
            __reject(ex);
          }
        } : __reject,
      );
      _then = 0;
      return () => {
        cancel();
        const _onCancel = onCancel;
        onResolve = onReject = onCancel = 0;
        _onCancel && executeTry(_onCancel, null, null, onErrorCancel);
      };
    });
  }
  function cancelablePromiseResolve(subject) {
    return provide((resolve) => {
      resolve(subject);
    });
  }
  function cancelablePromiseDelay(delay, subject, rejected) {
    return provide((resolve, reject) => {
      return delayFn(rejected ? reject : resolve, delay, [subject]);
    });
  }
  function cancelablePromiseAll(promises) {
    const length = promises.length;
    return length ? provide((resolve, reject) => {
      function setValue(index, value) {
        output[index] = value;
        ++loaded < length || resolve(output);
      }
      const pendings = [];
      const output = new Array(length);
      let loaded = 0;
      forEach(promises, (value, index) => {
        isPromise(value) ? pendings.push(value.then((value) => {
          setValue(index, value);
        }, reject)) : setValue(index, value);
      });
      return promisesCancelProvider(pendings);
    }) : cancelablePromiseResolve([]);
  }
  function cancelablePromiseRace(promises) {
    const length = promises.length;
    return length ? provide((resolve, reject) => {
      let pendings = [], i = 0, value; // eslint-disable-line
      for (; i < length; i++) {
        if (!isPromise(value = promises[i])) {
          resolve(value);
          break;
        }
        pendings.push(value.then(resolve, reject));
      }
      return promisesCancelProvider(pendings);
    }) : cancelablePromiseResolve();
  }

  function CancelablePromise(executor) {
    if (executor && !isFunction(executor)) {
      throw new Error('Executor param must be a function');
    }
    const self = this;
    let _pool = [];
    let _args;

    const init = subscribleInit((clear) => {
      function onResolve(subject, rejected, canceled, pool) {
        _args || (
          _args = [subject, rejected],
          pool = _pool,
          clear(),
          _pool = cancelResolve = cancelExecute = clearResolve
            = resolve = reject = fns = clear = 0,
          canceled || (
            rejected && (self._hasErrorHandle || pool.length
              || console.error('Unhandled promise rejection:', subject)),
            eachApply(pool)
          )
        );
      }
      let cancelResolve = noop;
      let fns = onceResolve((subject, rejected) => {
        function base(subject) {
          onResolve(subject, rejected);
        }
        _args || (
          cancelResolve = isPromise(subject)
            ? cancelableThen(subject, base, (subject) => {
              onResolve(subject, 1);
            })
            : deferApply(base, [subject])
        );
      });
      let resolve = self.resolve = fns[0];
      let reject = self.reject = fns[1];
      let clearResolve = fns[2];
      let cancelExecute = executor
        ? runExecutor(executor, resolve, reject)
        : noop;
      executor = 0;
      return () => {
        clearResolve && (
          clearResolve(),
          cancelExecute(),
          cancelResolve()
        );
        onResolve(null, new Error('Promise already canceled'), 1);
      };
    });
    self.cancel = init();

    self._then = (onResolve, onReject) => {
      function handle() {
        (_args[1] ? onReject : onResolve)(_args[0]);
      }
      return _args
        ? deferApply(handle)
        : (
          _pool.push(handle),
          init()
        );
    };
  }

  CancelablePromise.resolve = cancelablePromiseResolve;
  CancelablePromise.reject = (subject) => {
    return provide((resolve, reject) => {
      reject(subject);
    });
  };
  CancelablePromise.all = (promises) => {
    cancelablePromiseCheck(promises);
    if (isArray(promises)) {
      return cancelablePromiseAll(promises);
    }
    return cancelablePromiseAll(mapEach(
        promises = entries(promises),
        iterateeValue,
    )).then((values) => {
      const output = {};
      forEach(promises, (entry, index) => {
        output[entry[0]] = values[index];
      });
      return output;
    });
  };
  CancelablePromise.race = (promises) => {
    cancelablePromiseCheck(promises);
    return cancelablePromiseRace(
      isArray(promises) ? promises : getValues(promises),
    );
  };
  CancelablePromise.provide = provide;
  CancelablePromise.run = (fn, args, ctx) => {
    return cancelablePromiseResolve().then(() => {
      return fn.apply(ctx, args || []);
    });
  };
  CancelablePromise.runWithDelay = (fn, delay, args, ctx) => {
    return cancelablePromiseDelay(delay).then(() => {
      return fn.apply(ctx, args || []);
    });
  };
  CancelablePromise.delay = cancelablePromiseDelay;
  CancelablePromise.defer = (subject, rejected) => {
    return provide((resolve, reject) =>
      deferApply(rejected ? reject : resolve, [subject]));
  };
  CancelablePromise.promisify = (fn, self) => {
    return function() {
      const _self = self || this, _args = slice(arguments); // eslint-disable-line
      return provide((resolve, reject) => {
        _args.push((error, result) => {
          error
            ? reject(error)
            : resolve(result);
        });
        return fn.apply(_self, _args);
      });
    };
  };
  CancelablePromise.promisifyStream = (stream, onReadable) => {
    return provide((resolve, reject) => {
      stream.on('end', resolve);
      stream.on('error', reject);
      stream.on('readable', () => {
        onReadable(_read);
      });
      function _read() {
        return stream.read();
      }
      return () => {
        stream.destroy();
      };
    });
  };

  ParentClass && (CancelablePromise.prototype = create(ParentClass.prototype));
  extend(CancelablePromise.prototype, {
    then(onResolve, onReject, onCancel) {
      return thenCall(this._then, onResolve, onReject, onCancel);
    },
    catch(onReject, onCancel) {
      return thenCall(this._then, null, onReject, onCancel);
    },
    onCancel(onCancel) {
      return thenCall(this._then, null, null, onCancel);
    },
    finally(onFinally) {
      if (!isFunction(onFinally)) {
        throw new Error('The argument can only be a function');
      }
      const promise = thenCall(
          this._then,
          (subject) => {
            executeTry(onFinally, [null, subject, false], null, onErrorFinally);
            return subject;
          },
          (subject) => {
            executeTry(onFinally, [subject, null, false], null, onErrorFinally);
            throw subject;
          },
          () => {
            executeTry(onFinally, [null, null, true], null, onErrorFinally);
          },
      );
      promise._hasErrorHandle = 1;
      return promise;
    },
  });
  return CancelablePromise;
};
function onErrorCancel(error) {
  console.error('An error occurred in the "cancel" callback:', error);
}
function onErrorFinally(error) {
  console.error('An error occurred in the "finally" callback:', error);
}
function cancelPromise(promise) {
  promise.cancel && promise.cancel();
}
function promisesCancelProvider(promises) {
  return () => {
    forEach(promises, cancelPromise);
  };
}
function cancelablePromiseCheck(promises) {
  if (!isObject(promises)) {
    throw new TypeError('argument may only be an Object: ' + promises);
  }
}
function iterateeValue(line) {
  return line[1];
}
function subscribleInit(cancel) {
  let count = -1;
  cancel = cancel(() => {
    cancel = 0;
  });
  function cancelFn() {
    cancel && --count < 1 && (cancel(), cancel = 0);
  }
  return () => {
    count++;
    return once(cancelFn);
  };
}
function runExecutor(executor, resolve, reject) {
  let _cancel;
  normalizeCancel(executor(resolve, reject), (cancel) => {
    isFunction(cancel) && (_cancel = cancel);
  });
  executor = resolve = reject = 0;
  return () => {
    _cancel && executeTry(_cancel, null, null, onErrorCancel);
  };
}
function normalizeCancel(cancel, setCancel) {
  isPromise(cancel)
    ? setCancel(cancelableThen(cancel, setCancel))
    : setCancel(cancel);
}
function onceResolve(resolveBase) {
  return [
    (subject, _resolve) => {
      resolveBase && (
        _resolve = resolveBase,
        resolveBase = 0,
        _resolve(subject)
      );
    },
    (subject, _resolve) => {
      resolveBase && (
        _resolve = resolveBase,
        resolveBase = 0,
        _resolve(subject, 1)
      );
    },
    () => {
      resolveBase = 0;
    },
  ];
}
