/**
 * @overview withStateProvider
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 * @example
const withState = withStateProvider({
  Component: Component
});

const AnyComponent = withState((setState, self) => {
  return (state, props) => {
    return (
      <div>{state.limit}</div>
    );
  };
}, {
  limit: 10
});
*/

const childClassOfReact = require('../childClassOfReact');
const {
  combine,
} = require('../Observable');
const eachTry = require('../eachTry');
const forEach = require('../forEach');
const noop = require('../noop');
const push = require('../push');
const getByType = require('../getByType');

const ARG_TYPES = {
  'function': ['constructor'],
  'object': ['emitters'],
};

module.exports = (env) => {
  const {
    Component,
  } = env;
  return function() {
    // eslint-disable-next-line
    let constructor = getByType(arguments, ARG_TYPES);
    let emitter = combine(constructor.emitters || {});
    const {
      getValue,
      on,
    } = emitter;

    constructor = constructor.constructor;
    emitter = 0;

    return childClassOfReact(Component, (self) => {
      function onMount(cb) {
        push(_mountWatchers, cb);
      }
      function useEffect(cb, values) {
        push(_effects, [cb, values]);
      }
      function mountIteratee(cb) {
        push(_mountSubscriptions, cb() || noop);
      }
      self.state = getValue();
      self.render = () => {
        return render.apply(self, [
          self.state,
          self.props,
          useEffect,
        ]);
      };
      self.componentDidUpdate = () => {
        const effects = _effects;
        _effects = [];
        forEach(effects, (item, index, i, l, prev, cb, next, subscription) => {
          subscription = _effectSubscriptions[index] || noop;
          cb = item[0];
          next = item[1];
          (prev = _prevEffects[index]) && (prev = prev[1]);
          if (prev && next && (l = next.length) == prev.length) {
            for (i = 0; i < l; i++) {
              if (prev[i] !== next[i]) {
                subscription();
                return _effectSubscriptions[index] = cb() || noop;
              }
            }
            return;
          }
          subscription();
          _effectSubscriptions[index] = cb() || noop;
        });
        _prevEffects = effects;
      };
      self.UNSAFE_componentWillMount = () => {
        _subscription || (
          _subscription = on(setState),
          setState(getValue()),
          forEach(_mountWatchers, mountIteratee)
        );
      };
      self.componentWillUnmount = (w) => {
        _subscription && (
          _subscription(),
          _subscription = 0,
          _mountWatchers = [],
          w = _mountSubscriptions,
          _mountSubscriptions = [],
          eachTry(w),
          w = _effectSubscriptions,
          _effectSubscriptions = [],
          eachTry(w),
          _effects = [],
          _prevEffects = []
        );
      };
      let _subscription;
      let _mountWatchers = [];
      let _mountSubscriptions = [];
      let _effectSubscriptions = [];
      let _effects = [];
      let _prevEffects = [];
      const _setState = self.setState;
      self.setState = setState;
      function setState() {
        // eslint-disable-next-line
        _subscription && _setState.apply(self, arguments);
      }
      const render = constructor(setState, self, onMount);
    });
  };
};
