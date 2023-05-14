const merge = require('./merge');
const urlParse = require('./urlParse');
const param = require('./param');
const isObject = require('./isObject');
const isDefined = require('./isDefined');

function normalize(v, type) {
  return isDefined(v) ? (
    isObject(v) ? v : urlParse(v)
  ) : {};
}

function urlExtend(dst, src) {
  dst = normalize(dst);
  src = normalize(src);

  function __def(prop, def, v) {
    return ((v = src[prop]) === undefined ? dst[prop] : v) || def || '';
  }

  const hostname = __def('hostname');
  const protocol = __def('protocol');
  const port = __def('port');
  const username = __def('username');
  const password = __def('password');
  const userpart = username ? (username + ':' + password) : '';
  const host = hostname || port ? (hostname + (port ? (':' + port) : '')) : '';
  const email = username ? (username + '@' + host) : '';
  const login = userpart ? (userpart + '@' + host) : '';
  const unpath = login ? (protocol + '://' + login) : (host ? (protocol + '://' + host) : '');
  const extension = __def('extension');
  const alias = __def('alias');
  const filename = alias + (extension ? '.' + extension : '');
  const dirname = __def('dirname', filename ? '/' : '');
  const path = dirname + filename;
  const unalias = unpath + dirname;
  const // eslint-disable-line
    unextension = unalias + alias,
    unsearch = unextension + (extension ? '.' + extension : ''),
    query = merge([dst.query, src.query], {}),
    search = param(query);
  const unhash = unsearch + (search ? '?' + search : '');
  const srcChild = src.child, dstChild = dst.child; // eslint-disable-line
  const child = srcChild || dstChild
    ? urlExtend(dstChild || {}, srcChild || {}) : 0;
  const hash = child && child.href || '';
  const href = unhash + (hash ? '#' + hash : '');

  return merge([
    dst,
    src,
    {
      href,
      search,
      unhash,
      hash,
      query,
      protocol,
      path,
      unpath,
      hostname,
      host,
      port,
      unalias,
      dirname,
      filename,
      alias,
      unextension,
      extension,
      unsearch,
      userpart,
      username,
      password,
      email,
      login,
      child,
    },
  ]);
}
module.exports = urlExtend;
