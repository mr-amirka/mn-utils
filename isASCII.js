const REGEXP_ASCII = isASCII.REGEXP_ASCII
    = /[^A-Za-z0-9_:;\\\-+=|/*.,?&^%$#@!~`"'(){}\[\]<> ]/;
function isASCII(v) {
  return !!v && !REGEXP_ASCII.test(v);
}

module.exports = isASCII;
