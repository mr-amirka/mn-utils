const isFunction = require('./isFunction');
const isDefined = require('./isDefined');

function invoke(object, path, args, context) {
  return base(
      object,
      isDefined(path) ? ('' + path).split('.') : [],
      args,
      context,
  );
}
function base(object, path, args, context) {
  const length = path.length;
  let i = 0;
  let fn = object;
  while (fn && i < length) {
    object = fn;
    fn = object[path[i++]];
  }
  return i === length && isFunction(fn)
    ? fn.apply(context || object, args || [])
    : undefined;
}

invoke.base = base;
module.exports = invoke;
