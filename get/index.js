const base = get.base = require('./base');
get.getter = require('./getter');

function get(ctx, path, def) {
  return path
    ? (ctx ? base(ctx, ('' + path).split('.'), def) : def)
    : ctx;
}

module.exports = get;
