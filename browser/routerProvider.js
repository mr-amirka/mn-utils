/**
 * @overview routerProvider
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 *
 */

const isEqual = require('../isEqual');
const urlParse = require('../urlParse');
const urlExtend = require('../urlExtend');
const extend = require('../extend');
const map = require('../map');
const noop = require('../noop');
const keys = require('../keys');
const without = require('../without');
const routeParseProvider = require('../routeParseProvider');
const isMatch = require('../isMatch');
const childClassOfReact = require('../childClassOfReact');
const Observable = require('../Observable');

const WITHOUT_FIELDS_LINK = [
  'onClick', 'options', 'component', 'timeout', 'href',
  'activeAsParent',
  'active',
];

function mergeLocation(prev, exten) {
  const child = exten.child || {};
  const prevChild = prev.child || {};
  return urlExtend(exten.path || prev.path, {
    query: exten.query || null,
    child: urlExtend(child.path || prevChild.path, {
      query: child.query || null,
    }),
  });
}
function getPath(v) {
  return v.path || '';
}
function getChild(v) {
  return v.child || {};
}
function routerForObservableMapProvider(routes, notFoundHandler) {
  routes = map(routes, ([route, render]) => {
    return [routeParseProvider(route), render];
  });
  return (location) => {
    const path = location.path || '';
    const length = routes.length;
    let i = 0, params = {}, result, route; // eslint-disable-line
    for (; i < length; i++) {
      route = routes[i];
      if (
        route[0](path, params = {})
        && (result = route[1](params, location))
      ) return result;
    }
    return notFoundHandler && notFoundHandler(params, location) || null;
  };
}
function routerByLocationProviderProvider(location$) {
  return function routerByLocationProvider(routes, notFoundHandler) {
    return location$.map(routerForObservableMapProvider(routes, notFoundHandler));
  };
}
function routerProvider({
  Component,
  window,
  createElement,
  forwardRef,
}) {
  let hasDurationLink;
  let _globalLocation;
  let _locked;
  const {
    location,
    history,
  } = window;
  const location$ = new Observable(_globalLocation = parseLocation());
  const {
    emit: emitLocation,
  } = location$;
  const path$ = location$.map(getPath);
  const hashLocation$ = location$.map(getChild);
  const hashPath$ = hashLocation$.map(getPath);
  const Link = LinkProvider({ // eslint-disable-line
    pushLocation,
  });
  const HashLink = LinkProvider({ // eslint-disable-line
    pushLocation: pushHashLocation,
    hasHash: true,
  });
  const NavLink = NavLinkProvider(Link, location$); // eslint-disable-line
  const HashNavLink = NavLinkProvider(HashLink, hashLocation$); // eslint-disable-line

  window.addEventListener('popstate', () => {
    emitLocation(_globalLocation = parseLocation());
  });

  function parseLocation() {
    return urlParse(location.href);
  }
  function changeLocation(location, options, replace) {
    (replace ? history.replaceState : history.pushState).call(
        history, null, null, location.href,
    );
    _globalLocation = location;
    options && options.quiet || emitLocation(location);
    return location;
  }
  function pushLocation(extendsLocation, options) {
    return changeLocation(
        mergeLocation(_globalLocation, extendsLocation), options,
    );
  }
  function storagePushLocation(extendsLocation, options) {
    return changeLocation(
        urlExtend(_globalLocation, extendsLocation), options,
    );
  }
  function replaceLocation(extendsLocation, options) {
    return changeLocation(
        mergeLocation(_globalLocation, extendsLocation), options, 1,
    );
  }
  function pushHashLocation(child, options) {
    return pushLocation({
      child,
    }, options);
  }
  function storagePushHashLocation(child, options) {
    return storagePushLocation({
      child,
    }, options);
  }
  function replaceHashLocation(child, options) {
    return replaceLocation({
      child,
    }, options);
  }
  function backLocation() {
    history.back();
  }
  function LinkProvider({
    pushLocation,
    hasHash,
  }) {
    return forwardRef((props, ref) => {
      const onClick = props.onClick || noop;
      const options = urlExtend(props.href, props.options);
      const url = options.href;
      const timeout = props.timeout || 0;
      const addition = url ? {
        href: (hasHash ? ('#' + url) : url),
      } : {};
      addition.ref = ref;
      addition.onClick = url ? (e) => {
        e.preventDefault && e.preventDefault();
        if (!hasDurationLink) {
          hasDurationLink = 1;
          onClick(e);
          timeout
            ? setTimeout(action, timeout)
            : action();
        }
        return false;
      } : onClick;
      function action() {
        hasDurationLink = 0;
        props.active || pushLocation(options);
      }
      return createElement(
          props.component || 'a',
          without(props, WITHOUT_FIELDS_LINK, addition),
      );
    });
  }
  function NavLinkProvider(Link, location$) {
    const getLocation = location$.getValue;
    return childClassOfReact(Component, (self) => {
      let subscription;
      const setState = self.setState.bind(self);
      self.state = getLocation();
      self.UNSAFE_componentWillMount = () => {
        subscription || (subscription = location$.on(setState));
      };
      self.componentWillUnmount = () => {
        subscription && (subscription(), subscription = 0);
      };
      self.render = () => {
        const props = extend({}, self.props);
        const forwardedRef = props.forwardedRef;
        const {
          state,
        } = self;
        const path = state.path || '/';
        const matchs = urlExtend(props.href, props.options);
        const targetPath = matchs.path;
        const hasActive = path === targetPath
          && isMatch(state.query, matchs.query);

        if (forwardedRef) {
          delete props.forwardedRef;
          props.ref = forwardedRef;
        }

        if (
          hasActive || props.activeAsParent && path.startsWith(
            targetPath.slice(-1) === '/' ? targetPath : (targetPath + '/'),
          )
        ) {
          props.active = hasActive;
          props.className = 'active ' + (props.className || '');
        }

        return createElement(Link, props);
      };
    });
  }

  function paramStorageProvider(location$, pushLocation) {
    const query$ = location$.map('query');
    const instance = new Observable({});
    const emit = instance.emit;
    let state = query$.getValue() || {};

    function setState(query) {
      _locked = 1;
      pushLocation({query});
      changeState(query);
      _locked = 0;
    }
    function set(key, v, nextState) {
      isEqual(v, state[key]) || (
        nextState = map(state),
        nextState[key] = v,
        setState(nextState)
      );
      return instance;
    }

    instance.set = set;
    instance.get = (key) => state[key];
    instance.remove = (key) => set(key);
    instance.getKeys = () => keys(state);
    instance.clear = () => {
      setState({});
      return instance;
    };
    function changeState(nextState) {
      const prev = state;
      const exclude = {};
      const changed = {};
      let v, k; // eslint-disable-line
      state = nextState;
      for (k in state) { // eslint-disable-line
        exclude[k] = 1;
        isEqual(prev[k], v = state[k]) || (changed[k] = v);
      }
      for (k in prev) exclude[k] // eslint-disable-line
        || isEqual(prev[k], v = state[k]) || (changed[k] = v);
      for (k in changed) emit({ // eslint-disable-line
        key: k,
        value: changed[k],
      });
    }
    query$.on((state) => {
      _locked || changeState(state || {});
    });
    return instance;
  }

  return {
    location$,
    path$,
    hashLocation$,
    hashPath$,
    LinkProvider,
    routerForObservableMapProvider,
    paramStorageProvider,
    routerByLocationProvider: routerByLocationProviderProvider(location$),
    routerByHashLocationProvider:
      routerByLocationProviderProvider(hashLocation$),
    paramStorage: paramStorageProvider(location$, storagePushLocation),
    hashParamStorage:
      paramStorageProvider(hashLocation$, storagePushHashLocation),
    Link,
    NavLink,
    HashLink,
    HashNavLink,
    getLocation: parseLocation,
    pushLocation,
    replaceLocation,
    pushHashLocation,
    replaceHashLocation,
    storagePushLocation,
    storagePushHashLocation,
    backLocation,
  };
};

routerProvider.mergeLocation = mergeLocation;
routerProvider.routerForObservableMapProvider = routerForObservableMapProvider;
routerProvider.routerByLocationProviderProvider
  = routerByLocationProviderProvider;

module.exports = routerProvider;
