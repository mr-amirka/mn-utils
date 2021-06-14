const noop = require('../noop');
const extend = require('../extend');
const merge = require('../merge');
const reduce = require('../reduce');
const isCollection = require('../isCollection');
const isObjectLike = require('../isObjectLike');
const isPromise = require('../isPromise');
const isEmitter = require('../isEmitter');
const isFunction = require('../isFunction');
const addOf = require('../addOf');
const removeOf = require('../removeOf');
const forEach = require('../forEach');
const forIn = require('../forIn');
const map = require('../map');
const each = require('../each');
const defer = require('../defer');
const withReDelay = require('../withReDelay');
const cancelableThen = require('../cancelableThen');
const iterateeNormalize = require('../iterateeNormalize');
const aggregateSubscriptions = require('../aggregateSubscriptions');
const set = require('../set');
const get = require('../get');
const getter = get.getter;
const setBase = set.base;
const getBase = get.base;

const EMITTER_COMBINE_DEFAULT_DEPTH = 10;

function emitNoop() {
  // eslint-disable-next-line
  console.warn('Emitter warning: this emitter is child, this method "emit" does not work.');
}
function iterateeWarning(instance, key) {
  instance === undefined
    && console.warn('Emitter warning: ' + key + ' is undefined');
}

function combine(emitters) {
  if (!isCollection(emitters)) return new Emitter(emitters);
  let watchEmitters = [], emits = {}, _subscription, _value; // eslint-disable-line
  each(emitters, iterateeWarning);
  extract([], emitters, EMITTER_COMBINE_DEFAULT_DEPTH);
  function extract(path, src, depth) {
    return isEmitter(src) ? (
      setBase(emits, path, src.emit),
      watchEmitters.push([path, src]),
      src
    ) : (
      --depth < 1 || !isCollection(src)
        ? src
        : map(src, (v, k) => extract(path.concat([k]), v, depth))
    );
  }
  function onDestroy() {
    _subscription();
    _subscription = 0;
  }
  function getValue() {
    return combineGetValueBase(emitters, EMITTER_COMBINE_DEFAULT_DEPTH);
  }
  return new Emitter({
    emit: (v) => combineEmitBase(emits, v, EMITTER_COMBINE_DEFAULT_DEPTH),
    getValue: () => _subscription ? _value : getValue(),
    on: (watcher) => {
      let subscribed = 0;
      _subscription = aggregateSubscriptions(
          map(watchEmitters, (args) => {
            const path = args[0];
            return args[1].on((item) => {
              item === getBase(_value, path)
                || subscribed
                && watcher(setBase(_value = map(_value), path, item));
            });
          }),
      );
      _value = getValue();
      subscribed = 1;
      return onDestroy;
    },
  });
}
function combineGetValueBase(src, depth) {
  return isEmitter(src)
    ? src.getValue()
    : (
      depth-- < 1 || !isCollection(src)
        ? src
        : map(src, (v) => combineGetValueBase(v, depth))
    );
}
function combineEmitBase(emit, src, depth) {
  if (isFunction(emit)) return emit(src);
  if (depth < 1) return;
  depth--;
  let k, e; //eslint-disable-line
  for (k in src) (e = emit[k]) && combineEmitBase(e, src[k], depth); //eslint-disable-line
}

function initRootEmitter(self, _init, _value, hasReinit) {
  const _watchers = [];
  let _initCancel = noop;
  self._cancel = noop;
  self.on = on;
  self.emit = emit;
  self.getValue = getValue;

  if (!isFunction(_init)) {
    _value = _init;
    _init = noop;
  }
  if (isPromise(_value)) {
    const promise = _value;
    _value = undefined;
    emit(promise);
  }

  function __emit(value) {
    _value === value
      || (self._cancel(), forEach(_watchers, tryWithValue(_value = value)));
  }
  function emit(value) {
    self._cancel = asyncable(value, __emit);
  }
  function getValue() {
    return _value;
  }
  function onDestroy() {
    _watchers.length < 1 && (
      _initCancel(),
      hasReinit && (init = 0)
    );
  }
  function on(watcher) {
    if (_init) {
      const _watchers = [], init = _init; // eslint-disable-line
      _init = 0;
      _initCancel = init(
          emit,
          getValue,
          (watcher) => subscribeProvider(_watchers, watcher, onDestroy),
      ) || noop;
      on((value) => {
        forEach(_watchers, tryWithValue(value));
      });
    }
    return subscribeProvider(_watchers, watcher, onDestroy);
  }
}

function Emitter(_init, _value) {
  const self = this;
  const on = _init && _init.on;
  const getValue = _init && _init.getValue;
  if (!(isFunction(on) && isFunction(getValue))) {
    return initRootEmitter(self, _init, _value);
  }
  extend(self, _init);
  const _watchers = [];
  let _subscription;
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
    _subscription || (_subscription = on(onEmit), _value = getValue());
    return subscription;
  };
}

function subscribeProvider(watchers, watcher, onDestroy) {
  addOf(watchers, watcher);
  return function() {
    watcher && (
      removeOf(watchers, watcher),
      onDestroy && onDestroy(),
      onDestroy = watcher = watchers = 0
    );
  };
}

combine.some = (emitters, _value) => {
  const ons = map(emitters, 'on');
  return new Emitter({
    getValue: () => _value,
    on: (watcher) => aggregateSubscriptions(map(ons, (on) => on((v) => {
      watcher(_value = v);
    }))),
  });
};
Emitter.combine = combine;
Emitter.provider = (init, value) => new Emitter(init, value);
Emitter.isEmitter = isEmitter;
Emitter.prototype = {
  _cancel: noop,
  emit: emitNoop,
  on: () => noop,
  getValue: noop,
  /*
    Добавление экземпляру эмиттера методов.
    @example:
    const emitter = emitterProvider(0);

    // добавление методов
    emitter.behave({
      enable: (emit) => emit(1),
      disable: (emit) => emit(0),
      toggle: (emit, _, getState) => emit(!getState()),
    });

    // использование методов
    emitter.enable();
    emitter.disable();
    emitter.toggle(); // переключение тумблера


    @example:
    const emitter = emitterProvider(0);
    // добавление методов
    emitter.behave({
      select: (emit, id) => emit(id),
      clear: (emit) => emit(0),
      toggle: (emit, id, getState) => emit(getState() === id ? 0 : id),
    });

    // использование методов
    emitter.select(10); // выбрали пункт меню с id 10
    emitter.clear(); // очистка
    emitter.toggle(10); // если этот элемент был выбран, то очистка,
      если элемент не был выбран, то он выбирается.

    @example:
    const emitter = emitterProvider(0);
    const enableBehavior = {
      enable: (emit) => emit(1),
      disable: (emit) => emit(0),
    };
    const toggleBehavior = {
      toggle: (emit, _, getState) => emit(!getState()),
    };

    // добавление методов
    emitter.behave([ enableBehavior, toggleBehavior ]);

    // использование методов
    emitter.enable();
    emitter.disable();
    emitter.toggle();
  */

  behave(methods) {
    const self = this;
    const {getValue, emit} = self;
    forIn(merge(methods), (method, methodName) => {
      self[methodName] = (value) => method(emit, value, getValue);
    });
    return self;
  },

  pipe() {
    return reduce(arguments, (emitter, pipe) => pipe(emitter), this); // eslint-disable-line
  },
  fork(extended, value) {
    return new Emitter(extend(extend({}, this), extended), value);
  },

  /*
   Аналог setState в React, только для эмиттера и выполняет обновление состояния
    немедленно.
   Поверхностно объединяет переданное значение с внутренним значением состояния.
  */
  set(updatedState) {
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

  map(mapOut, mapIn, value) {
    mapOut = getter(mapOut);
    mapIn = getter(mapIn);
    const self = this;
    const {emit, on, getValue} = self;
    let _value = value, cancelOut = noop, _watcher = noop, _subscripion; // eslint-disable-line
    const getValueOut = mapOut ? (() => {
      _subscripion || asyncable(mapOut(getValue()), update);
      return _value;
    }) : getValue;
    const emitter = self.fork({
      emit: mapIn ? (isFunction(mapIn) ? (value) => {
        emitter._cancel();
        emitter._cancel = asyncable(value, (value) => {
          emit(mapIn(value, getValue));
        });
      } : emit) : emitNoop,
      getValue: getValueOut,
      on: mapOut ? ((watcher) => {
        _value = getValueOut();
        _watcher = watcher;
        _subscripion = on((value) => {
          cancelOut();
          cancelOut = asyncable(mapOut(value), update);
        });
        return () => {
          _subscripion && (_watcher = noop, _subscripion(), _subscripion = 0);
        };
      }) : on,
    }, _value);
    function update(value) {
      _value === value || _watcher(_value = value);
    }
    return emitter;
  },

  prop(path, defaultValue) {
    path = path.split('.');
    let cache;
    return this.map(
        (v) => (cache = v) && getBase(v, path),
        (v) => setBase(extend({}, cache), path, v),
        defaultValue,
    );
  },

  filter(check) {
    check = iterateeNormalize(check);
    const {on} = this;
    return this.fork({
      on: (watcher) => on((value) => {
        check(value) && watcher(value);
      }),
    });
  },

  is(standart) {
    return this.map((v) => v === standart, (v) => v ? standart : null);
  },

  /*
    Получить дочерний эмиттер, который будет эмититься с задержкой "wait"
    от родительского эмиттера.
    Можно указать занчение по умочланию "_value".
  */
  delay(wait, _value) {
    const self = this;
    const __on = self.on;
    if (_value === undefined) _value = self.getValue();
    return self.fork({
      on: (watcher) => {
        return __on(withReDelay((value) => {
          watcher(_value = value);
        }, wait));
      },
      getValue: () => _value,
    });
  },
};

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
      watchers.length < 1 && onDestroy(),
      onDestroy = watchers = watcher = 0
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

module.exports = Emitter;
