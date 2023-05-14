const merge = require('./merge');

function base(src, id, dst, depth) {
  const length = src.length;
  depth--;
  for (let _id, item, i = 0; i < length; i++) {
    if ((item = src[i]) && (item.parent == id)) {
      _id = item.id;
      dst.push(depth > 0 ? merge([
        item,
        {childs: _id ? base(src, _id, [], depth) : []},
      ]) : item);
    }
  }
  return dst;
}

module.exports = (src, id, dst, depth) => base(src, id, dst || [], depth || 10);
