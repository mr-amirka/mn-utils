const isObjectLike = require('./isObjectLike');
const isNumber = require('./isNumber');
const half = require('./half');
const decode = require('./tryJsonParse');

const expSpace = /\+/g;
const expBrackets = /\[(.*?)\]/g;
const expVarname = /(.+?)\[/;

function unparam(s) {
  const type = typeof s;
  return type === 'string' ? base(s) : (type === 'object' ? s : {});
}
function base(s) {
  const a = half(s, '?', 1)[1].split('&');
  const l = a.length;
  const r = {};
  let w, t, k, v, _v, b, c, d, j, n, ni, q, i = 0; // eslint-disable-line
  if (l < 1) return r;
  for (;i < l; i++) {
    k = (w = half(a[i], '='))[0];
    if (!k) continue;
    isNumber(_v = decode(decodeURIComponent(v = w[1].replace(expSpace, ' '))))
      || (v = _v);
    b = [];
    while (w = expBrackets.exec(k)) b.push(w[1]);
    if ((c = b.length) < 1) {
      r[k] = v;
      continue;
    }
    c--;
    w = expVarname.exec(k);
    if (!w || !(k = w[1]) || w.length < 1) continue;
    if (!isObjectLike(d = r[k])) d = r[k] = {};
    for (j = 0, q = b.length; j < q; j++) {
      if ((w = b[j]).length < 1) {
        w = 0;
        for (n in d) {
          if (!isNaN(ni = parseInt(n)) && ni >= 0
            && (ni % 1 === 0) && ni >= w) w = ni + 1;
        }
      }
      j == c ? (d[w] = v) : (d = isObjectLike(t = d[w]) ? t : (d[w] = {}));
    }
  }
  return r;
}

unparam.base = base;
module.exports = unparam;
