const isPromise = require('../../isPromise');
const isFunction = require('../../isFunction');
const cancelableThen = require('../../cancelableThen');

/*
  Директива инициализирует дочерние элементы узла и позволяет задать scope
  для дочерних элементов.
  Если в опции директивы передан null,
  то дочерние элементы инициализируется с текущим scope
*/
module.exports = function(ctx) {
  const {node, options$, scope, destroy, compile} = ctx;
  let cancel, childScope = options$.getValue(); // eslint-disable-line
  function init(childScope) {
    compile.child(node, childScope || scope, destroy.child());
  }
  if (isFunction(childScope)) childScope = childScope.call(scope, ctx);
  isPromise(childScope)
    ? destroy.add(cancel = cancelableThen(childScope, (v) => {
      destroy.remove(cancel);
      init(v);
    }))
    : init(childScope);
};
