/**
 * @overview url
 * - парсит URL
 *
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 */

const half = require('./half');
const unparam = require('./unparam');
const isDefined = require('./isDefined');
const halfLast = half.last;

function urlParse(href) {
  href = isDefined(href) ? ('' + href) : '';
  let parts = half(href, '#');
  const hash = parts[1];
  const unhash = parts[0];
  let unsearch = (parts = half(unhash, '?'))[0];
  let search = parts[1];

  if (!search && unsearch.indexOf('/') == -1 && unsearch.indexOf('=') > -1) {
    search = unsearch;
    unsearch = '';
  }

  const query = unparam(search);
  const child = hash ? urlParse(hash) : 0;
  const protocol = (parts = half(unsearch, '://', 1))[0];
  const basePath = parts[1];

  parts = protocol ? half(basePath, '/') : ['', basePath];

  const path = (parts[2] ? '/' : '') + parts[1];
  const userpart = (parts = half(parts[0], '@', true))[0];
  const userParts = half(userpart, ':');
  const username = userParts[0];
  const password = userParts[1];
  const host = protocol ? parts[1] : '';
  const email = username ? (username + '@' + host) : '';
  const hostname = protocol ? (parts = half(host, ':'))[0] : '';
  const port = protocol ? parts[1] : '';
  const login = userpart ? (userpart + '@' + host) : '';
  const unpath = login ? (protocol + '://' + login) : (host ? (protocol + '://' + host) : '');

  parts = halfLast(path, '/', true);
  const dirname = parts[0] + (parts[2] ? '/' : '');
  const filename = parts[1];
  const unalias = unpath + dirname;
  const alias = (parts = halfLast(filename, '.'))[0];
  const unextension = unalias + alias;
  const extension = parts[1];

  return {
    href,
    search,
    unhash,
    hash,
    query,
    protocol,
    basePath,
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
    login,
    password,
    email,
    child,
  };
};
module.exports = urlParse;

// console.log(urlParse('http://eko-press.dartline.ru/api/'));

// console.log(urlParse('http://username:password@eko-press.dartline.ru/api.php?callback=JSONP_1&entity=navigation&method=GET&timestamp=1546178631496'));

// console.log(urlParse('http://eko-press.dartline.ru/api.php'));
// console.log(urlParse('https://localhost:80/api/v1/method.json?sa=10#path/as?asd=29'));
