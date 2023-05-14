const noop = require('../noop');
const some = require('../some');
const extend = require('../extend');
const extendOwn = require('../extendOwn');
const reduce = require('../reduce');
const slice = require('../slice');
const isCollection = require('../isCollection');
const isObjectLike = require('../isObjectLike');
const isPromise = require('../isPromise');
const isObservable = require('../isObservable');
const isFunction = require('../isFunction');
const addOf = require('../addOf');
const removeOf = require('../removeOf');
const forEach = require('../forEach');
const map = require('../map');
const each = require('../each');
const defer = require('../defer');
const bind = require('../bind');
const cancelableThen = require('../cancelableThen');
const iterateeNormalize = require('../iterateeNormalize');
const aggregateSubscriptions = require('../aggregateSubscriptions');
const set = require('../set');
const get = require('../get');
const getter = get.getter;
const setBase = set.base;
const getBase = get.base;

const OBSERVABLE_COMBINE_DEFAULT_DEPTH = 10;

function emitNoop() {
  // eslint-disable-next-line
  console.warn('Observable warning: this observable is child, this method "emit" does not work.');
}
function iterateeWarning(instance, key) {
  instance === undefined
    && console.warn('Observable warning: ' + key + ' is undefined');
}

function combine(observables, sync) {
  if (!isCollection(observables)) {
    return new Observable(observables);
  }
  let ons = [], emits = {}, _subscription, _value; // eslint-disable-line
  each(observables, iterateeWarning);
  extract([], observables, OBSERVABLE_COMBINE_DEFAULT_DEPTH);
  function extract(path, src, depth) {
    isObservable(src) ? (
      setBase(emits, path, src.emit),
      ons.push([path, src.on])
    ) : (
      !isCollection(src)
      || --depth < 1
      || each(src, (v, k) => extract(path.concat([k]), v, depth))
    );
  }
  function onDestroy() {
    _subscription();
    _subscription = 0;
  }
  function getValue() {
    return combineGetValueBase(observables, OBSERVABLE_COMBINE_DEFAULT_DEPTH);
  }
  return new Observable({
    emit: (v) => combineEmitBase(emits, v, OBSERVABLE_COMBINE_DEFAULT_DEPTH),
    getValue: () => _subscription ? _value : getValue(),
    on: sync
      ? ((watcher) => {
        _subscription = aggregateSubscriptions(
            map(ons, (args) => {
              const path = args[0];
              return args[1]((item) => {
                item === getBase(_value, path)
                  || watcher(setBase(_value = map(_value), path, item));
              });
            }),
        );
        _value = getValue();
        return onDestroy;
      })
      : ((watcher) => {
        function set() {
          const next = triggered;
          triggered = 0;
          watcher(_value = next);
        }
        let triggered;
        _subscription = aggregateSubscriptions(
            map(ons, (args) => {
              const path = args[0];
              return args[1]((item) => {
                item === getBase(triggered || _value, path) || (
                  triggered
                    ? setBase(triggered, path, item)
                    : (
                      setBase(triggered = map(_value), path, item),
                      defer(set)
                    )
                );
              });
            }),
        );
        _value = getValue();
        return onDestroy;
      }),
  });
}
function combineSync(observables) {
  return combine(observables, true);
}
function combineGetValueBase(src, depth) {
  return isObservable(src)
    ? src.getValue()
    : (
      !isCollection(src) || depth-- < 1
        ? src
        : map(src, (v) => combineGetValueBase(v, depth))
    );
}
function combineEmitBase(emit, src, depth) {
  if (isFunction(emit)) return emit(src);
  if (depth < 1) return;
  depth--;
  let k, e; // eslint-disable-line
  for (k in src) (e = emit[k]) && combineEmitBase(e, src[k], depth); // eslint-disable-line
}

function initRootObservable(self, _init, _value) {
  const _watchers = [];
  let _subscription;
  self.on = on;
  self.emit = emit;
  self.getValue = getValue;

  isFunction(_init) || (
    _value = _init,
    _init = noop
  );
  isPromise(_value) && (
    emit(_value),
    _value = undefined
  );

  function __emit(value) {
    _value === value || (
      self._cancel(),
      forEach(_watchers, tryWithValue(_value = value))
    );
  }
  function emit(value) {
    self._cancel = asyncable(value, __emit);
  }
  function getValue() {
    return _value;
  }
  function onDestroy() {
    _subscription();
    _subscription = 0;
  }
  function on(watcher) {
    _subscription
      || isFunction(_subscription = _init.call(self, emit, getValue))
      || (_subscription = noop);
    return subscribe(_watchers, watcher, onDestroy);
  }
}

function Observable(_init, _value) {
  const self = this;
  if (!(isObservable(_init))) {
    return initRootObservable(self, _init, _value);
  }
  const {
    on,
    getValue,
  } = _init;
  const _watchers = [];
  let _subscription;
  extendOwn(self, _init);
  function onEmit(value) {
    forEach(_watchers, tryWithValue(_value = value));
  }
  function onDestroy() {
    _subscription();
    _subscription = 0;
  }
  self.getValue = () => _subscription ? _value : getValue();
  self.on = (watcher) => {
    const subscription = subscribe(_watchers, watcher, onDestroy);
    _subscription || (
      _subscription = on(onEmit),
      _value = getValue()
    );
    return subscription;
  };
}

combine.some = (observables, _value) => {
  observables = map(observables, 'on');
  return new Observable({
    getValue: () => _value,
    on: (watcher) => aggregateSubscriptions(map(observables, (on) => on((v) => {
      watcher(_value = v);
    }))),
  });
};
Observable.wrap = (attachEvent) => {
  if (!isFunction(attachEvent)) {
    throw new Error('The argument can only be a function');
  }
  return function() {
    const self = this, args = slice(arguments); // eslint-disable-line
    return new Observable((emit) => {
      args.push(emit);
      // eslint-disable-next-line
      return attachEvent.apply(null, args);
    });
  };
};
Observable.combine = combine;
Observable.combineSync = combineSync;
Observable.some = (values) => combine(values).map(some);
Observable.someSync = (values) => combineSync(values).map(some);
Observable.provider = (init, value) => new Observable(init, value);
Observable.isObservable = isObservable;
Observable.prototype = {
  _cancel: noop,
  emit: emitNoop,
  on: () => noop,
  getValue: noop,
  pipe() {
    return reduce(arguments, (observable, pipe) => pipe(observable), this); // eslint-disable-line
  },
  fork(extended, value) {
    return new Observable(extend(extendOwn({}, this), extended), value);
  },

  /*
   Аналог setState в React, только для эмиттера и выполняет обновление состояния
    немедленно.
   Поверхностно объединяет переданное значение с внутренним значением состояния.
  */
  extend(updatedState) {
    this.emit(
      isObjectLike(updatedState)
        ? extend(extend({}, this.getValue()), updatedState)
        : updatedState,
    );
  },

  // операция сложения числа к текущему значению в эмиттере
  calc(v) {
    this.emit(this.getValue() + v);
  },

  map(mapOut, mapIn, _value) {
    mapOut = getter(mapOut);
    mapIn = getter(mapIn);
    const self = this;
    const {
      emit,
      on,
      getValue,
    } = self;
    let _subscripion; // eslint-disable-line
    const getValueOut = mapOut ? (() => {
      _subscripion || asyncable(mapOut(getValue()), updateGetValue);
      return _value;
    }) : getValue;
    const observable = self.fork({
      emit: mapIn ? (isFunction(mapIn) ? (value) => {
        observable._cancel();
        observable._cancel = asyncable(value, __emit);
      } : emit) : emitNoop,
      getValue: getValueOut,
      on: mapOut ? ((watcher) => {
        function update(value) {
          _value === value || (
            _value = value,
            watcher && watcher(_value)
          );
        }
        let cancelOut = asyncable(mapOut(getValue()), update);
        _subscripion = on((value) => {
          cancelOut();
          cancelOut = asyncable(mapOut(value), update);
        });
        return () => {
          _subscripion && (watcher = 0, _subscripion(), _subscripion = 0);
        };
      }) : on,
    }, _value);
    function updateGetValue(value) {
      _value = value;
    }
    function __emit(value) {
      emit(mapIn(value, getValue));
    }
    return observable;
  },

  prop(path, defaultValue) {
    path = path.split('.');
    const self = this;
    const {
      getValue,
    } = self;
    return self.map(
        (v) => getBase(v, path),
        (v) => setBase(extend({}, getValue()), path, v),
        defaultValue,
    );
  },

  filter(check) {
    check = iterateeNormalize(check);
    const {
      on,
    } = this;
    return this.fork({
      on: (watcher) => on((value) => {
        check(value) && watcher(value);
      }),
    });
  },

  is(standart) {
    return this.map((v) => v === standart, (v) => v ? standart : null);
  },

  reDelay: mapWithOptionsProvider(require('../withReDelay')),
  delay: mapWithOptionsProvider(require('../withDelay')),
  throttle: mapWithOptionsProvider(require('../throttle')),

  bind(value) {
    // eslint-disable-next-line
    return bind(this.emit, this, [value]);
  },
  /*
  bindFn(fnName) {
    // eslint-disable-next-line
    return bind(this[fnName], this, slice(arguments, 1));
  },
  */
};

function mapWithOptionsProvider(wrapper) {
  return function() {
    const __args = arguments; // eslint-disable-line
    const self = this;
    const {
      on,
      getValue,
    } = self;
    let _value = getValue();
    return self.fork({
      on: (watcher) => {
        const args = [watcher];
        args.push.apply(args, __args); // eslint-disable-line

        _value = getValue();
        // eslint-disable-next-line
        const wrappedWatcher = wrapper.apply(null, args);

        return on((value) => {
          wrappedWatcher(_value = value);
        });
      },
      getValue: () => _value,
    });
  };
}

function asyncable(v, emit, hasAsync) {
  return isPromise(v)
    ? cancelableThen(v, emit)
    : (hasAsync ? defer(emit, [v]) : (emit(v), noop));
}
function subscribe(watchers, watcher, onDestroy) {
  addOf(watchers, watcher);
  return () => {
    watcher && (
      removeOf(watchers, watcher),
      watcher = 0,
      watchers.length || onDestroy(),
      onDestroy = watchers = 0
    );
  };
}
function tryWithValue(value) {
  return (watcher) => {
    try {
      watcher(value);
    } catch (ex) {
      console.error(ex);
    }
  };
}

module.exports = Observable;
