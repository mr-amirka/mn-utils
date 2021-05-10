const create = require('./create');
const delay = require('./delay');
const defer = require('./defer');
const eachApply = require('./eachApply');
const executeTry = require('./executeTry');
const destroyProvider = require('./destroyProvider');
const isObject = require('./isObject');
const isFunction = require('./isFunction');
const isPromise = require('./isPromise');
const isArray = require('./isArray');
const forEach = require('./forEach');
const {getter} = require('./get');

module.exports = function(ctx) {
  ctx = ctx || {};
  const __deferApply = ctx.defer || defer;
  const ParentClass = ctx.ParentClass;

  function CancelablePromise(executor, deferApply) {
    deferApply = deferApply || __deferApply;
    const self = this;
    let poolResolve = [];
    let poolReject = [];
    let done;
    let subject;
    let error;
    let innerCancel = self.cancel = cancelNoop;
    function clear() {
      poolResolve = [];
      poolReject = [];
    }
    function normalizeWrap(onResolve, onReject) {
      return (subject) => {
        return deferApply(() => {
          if (!isPromise(subject)) return onResolve(subject);
          const next = subject.then(onResolve, onReject);
          innerCancel = next && next.cancel || cancelNoop;
        });
      };
    }
    function resolve(_subject) {
      done || (
        done = 1,
        eachApply(poolResolve, [subject = _subject]),
        clear()
      );
    }
    function reject(_subject) {
      done || (
        done = error = 1,
        eachApply(poolReject, [subject = _subject]),
        clear()
      );
    }

    const _resolve = self.resolve = normalizeWrap(resolve, reject);
    const _reject = self.reject = normalizeWrap(reject, reject);
    const init = subscribleInit(() => {
      let __cancel = !done && executor ? deferApply(() => {
        try {
          const _cancel = executor(_resolve, _reject);
          isFunction(_cancel) && (__cancel = _cancel);
        } catch (ex) {
          _reject(ex);
        }
      }) : cancelNoop;
      return () => {
        innerCancel();
        __cancel();
        clear();
      };
    });

    function __chain(onResolve, onReject) {
      if (done) return (error ? onReject : onResolve)(subject);
      poolResolve.push(onResolve);
      poolReject.push(onReject);
    }
    function __then(onResolve, onReject, onCancel) {
      onResolve = getter(onResolve);
      onReject = getter(onReject);

      const cancel = destroyProvider();
      if (!done) {
        cancel.add(init());
        onCancel && cancel.add(() => {
          done || onCancel();
        });
      }
      const promise = new CancelablePromise(
          subscribleProvider((__resolve, __reject) => {
            const __clear = cancel.clear;
            cancel.add(deferApply(() => {
              __chain(
                onResolve ? (subject) => {
                  __clear();
                  try {
                    __resolve(onResolve(subject));
                  } catch (ex) {
                    __reject(ex);
                  }
                } : __resolve,
                onReject ? (error) => {
                  __clear();
                  try {
                    __resolve(onReject(error));
                  } catch (ex) {
                    __reject(ex);
                  }
                } : __reject,
              );
            }));
            return cancel;
          }),
          deferApply,
      );
      promise.cancel = cancel;
      return promise;
    }
    self.then = __then;
    self.catch = (onReject, onCancel) => __then(null, onReject, onCancel);
    self.finally = (onFinally) => {
      return onFinally ? __then(
          (subject) => {
            executeTry(onFinally, [null, subject]);
            return subject;
          },
          (subject) => {
            executeTry(onFinally, [subject]);
            throw subject;
          },
          () => {
            executeTry(onFinally, [null]);
          },
      ) : __then();
    };
    self.onCancel = (onCancel) => __then(null, null, onCancel);
  }

  CancelablePromise.resolve = (subject, deferApply) => {
    return new CancelablePromise((resolve) => resolve(subject), deferApply);
  };
  CancelablePromise.reject = (subject, deferApply) => {
    return new CancelablePromise(
        (resolve, reject) => reject(subject),
        deferApply,
    );
  };
  CancelablePromise.all = (promises, deferApply) => {
    return new CancelablePromise((resolve, reject) => {
      if (!isObject(promises)) {
        throw new TypeError('argument may only be an Object: ' + promises);
      }
      function clear() {
        stop = 1;
        forEach(pendingPromises, cancelPromise);
      }
      function onReject(subject) {
        if (stop) return;
        clear();
        reject(subject);
      }
      function setValue(key, value) {
        output[key] = value;
        ++loaded < length || resolve(output);
      }
      function step(value, key) {
        isPromise(value)
          ? (stop
            ? cancelPromise(value)
            : pendingPromises.push(value.then(
                (value) => setValue(key, value),
                onReject,
            ))
          )
          : stop || setValue(key, value);
      }
      const pendingPromises = [];
      let stop;
      let output;
      let loaded = 0;
      let length = 1;
      let k;
      if (isArray(promises)) {
        output = new Array(length = promises.length);
        forEach(promises, step);
      } else {
        output = {};
        for (k in promises) { // eslint-disable-line
          length++;
          step(promises[k], k);
        }
        length--;
      }
      loaded < length || resolve(output);
      return clear;
    }, deferApply);
  };
  CancelablePromise.race = (promises, deferApply) => {
    return new CancelablePromise((resolve, reject) => {
      if (!isObject(promises)) {
        throw new TypeError('argument may only be an Object: ' + promises);
      }
      function clear() {
        stop = 1;
        forEach(pendingPromises, cancelPromise);
      }
      function onResolve(subject) {
        if (stop) return;
        clear();
        resolve(subject);
      }
      function setError(key, error) {
        errors[key] = error;
        ++loaded < length || reject(errors);
      }
      function step(value, key) {
        isPromise(value)
          ? (stop
            ? cancelPromise(value)
            : pendingPromises.push(value.then(
                onResolve,
                (error) => setError(key, error),
            ))
          )
          : stop || onResolve(value);
      }
      const pendingPromises = [];
      let stop;
      let errors;
      let loaded = 0;
      let length = 1;
      let k;
      if (isArray(promises)) {
        errors = new Array(length = promises.length);
        forEach(promises, step);
      } else {
        errors = {};
        for (k in promises) { // eslint-disable-line
          length++;
          step(promises[k], k);
        }
        length--;
      }
      loaded < length || reject(errors);
      return clear;
    }, deferApply);
  };
  CancelablePromise.delay = (_delay, subject, deferApply) => {
    return new CancelablePromise(
        (resolve) => delay(resolve, _delay, [subject]),
        deferApply,
    );
  };
  CancelablePromise.provide = (executor, deferApply) => {
    return new CancelablePromise(executor, deferApply);
  };
  CancelablePromise.defer = (fn, deferApply) => {
    return new CancelablePromise((resolve) => {
      resolve(fn && fn());
    }, deferApply);
  };

  ParentClass && (CancelablePromise.prototype = create(ParentClass.prototype));

  return CancelablePromise;
};
function cancelNoop() {
  return 0;
}
function cancelPromise(promise) {
  promise.cancel && promise.cancel();
}
function subscribleInit(init) {
  let count = 0;
  let cancel;
  return () => {
    count++;
    count == 1 && (cancel = init());
    return () => {
      if (count < 1) return 0;
      if (--count < 1) {
        cancel();
        cancel = null;
      }
      return 1;
    };
  };
}
function subscribleProvider(executor) {
  let _subject;
  let _error;
  let _done;
  let __onResolve;
  let __onReject;
  const cancel = executor(
      (subject) => {
        if (_done) return;
        _done = 1;
        _subject = subject;
        __onResolve && __onResolve(subject);
        __onResolve = __onReject = null;
      },
      (subject) => {
        if (_done) return;
        _error = _done = 1;
        _subject = subject;
        __onReject && __onReject(subject);
        __onResolve = __onReject = null;
      },
  );
  return (onResolve, onReject) => {
    if (_done) {
      (_error ? onReject : onResolve)(_subject);
    } else {
      __onReject = onReject;
      __onResolve = onResolve;
    }
    return cancel;
  };
}
