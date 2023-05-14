const pathToRegexp = require('path-to-regexp');
const once = require('../../once');
const toUpper = require('../../toUpper');
const METHODS = require('./methods.enum');


function iterateeName(item) {
  return item.name;
}
function routeProvider(path, middleware) {
  let keys = [];
  const re = pathToRegexp(path, keys);
  keys = keys.map(iterateeName);
  return (ctx, next) => {
    const m = re.exec(ctx.path);
    if (!m) return next();
    const values = m.slice(1);
    const params = ctx.params = {};
    for (let _keys = keys, l = _keys.length, v, i = 0; i < l; i++) {
      params[_keys[i]] = (v = values[i]) ? decodeURIComponent(v) : v;
    }
    return middleware(ctx, next);
  };
}
function mountProvider(path, middleware) {
  const length = path.length;
  return (ctx, next) => {
    const originPath = ctx.path || '';
    if (!originPath.startsWith(path)) {
      return next();
    }
    ctx.path = originPath.substr(length);
    function _next() {
      ctx.path = originPath;
      return next();
    }
    return new Promise((resolve, reject) => {
      try {
        resolve(middleware(ctx, _next));
      } catch (error) {
        ctx.path = originPath;
        reject(error);
      }
    });
  };
}
function routerProvider() {
  function router(ctx, next) {
    let i = 0;
    function _next() {
      const middleware = middlewares[i];
      i++;
      return middleware ? middleware(ctx, once(_next)) : next();
    }
    return _next();
  }
  const middlewares = [];
  const use = router.use = (middleware) => {
    middlewares.push(middleware);
    return router;
  };
  router.mount = (path, middleware) => use(mountProvider(path, middleware));
  router.route = (path, middleware) => use(routeProvider(path, middleware));

  METHODS.forEach((method) => {
    const methodUC = toUpper(method);
    router[method] = (path, middleware, onlyMount) => {
      return use(methodProvider(methodUC, (
        onlyMount ? mountProvider : routeProvider
      )(path, middleware)));
    };
  });

  router.del = router.delete;
  return router;
};

function methodProvider(method, middleware) {
  return (ctx, next) => ctx.method === method
    ? middleware(ctx, next)
    : next();
}
function restProvider(methods) {
  return __rest(__map(methods));
}
function __map(src) {
  const dst = {};
  let k;
  for (k in src) dst[toUpper(k)] = src[k]; // eslint-disable-line
  return dst;
}
function __rest(methods) {
  return (ctx, next) => {
    const middleware = methods[ctx.method];
    return middleware ? middleware(ctx, next) : next();
  };
}

routerProvider.mount = mountProvider;
routerProvider.route = routeProvider;
routerProvider.rest = restProvider;
routerProvider.method = methodProvider;
module.exports = routerProvider;
