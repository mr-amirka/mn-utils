const isString = require('./isString');

const // eslint-disable-line
  TOKEN_LINE = '\n',
  TOKEN_R = '\r',
  TOKEN_SPACE = ' ',
  TOKEN_COMMA = ',',
  TOKEN_DOT_COMMA = ';',
  TOKEN_DOUBLE_QUOTE = '"',
  TOKEN_ESCAPE = '\\';

module.exports = (v, delimeter) => {
  delimeter = delimeter || TOKEN_DOT_COMMA;
  const lines = [];
  if (!isString(v)) return lines;
  v = '' + v;
  function next() {
    start == i || col.push(v.slice(start, i));
  }
  function skipSpace() {
    ch = v[i];
    while (ch === TOKEN_SPACE || ch === TOKEN_R) {
      i++;
      ch = v[i];
    }
    start = i;
  }
  const l = v.length;
  let i = 0, rows = [], start, ch, col = []; // eslint-disable-line
  skipSpace();

  // lines
  while (i < l) {
    ch = v[i];
    if (ch === TOKEN_LINE) {
      next();
      rows.length && (
        rows.push(col.join('')),
        lines.push(rows)
      );
      col = [];
      rows = [];
      i++;
      skipSpace();
    } else if (
      ch === delimeter || ch === TOKEN_COMMA || ch === TOKEN_DOT_COMMA
    ) {
      next();
      rows.push(col.join(''));
      col = [];
      i++;
      skipSpace();
    } else if (ch === TOKEN_ESCAPE) {
      next();
      start = i + 1;
      i += 2;
    } else if (ch === TOKEN_DOUBLE_QUOTE) {
      next();
      i++;
      start = i;
      while (i < l) {
        ch = v[i];
        if (ch === TOKEN_ESCAPE) {
          next();
          start = i + 1;
          i += 2;
        } else if (ch === TOKEN_DOUBLE_QUOTE) {
          next();
          i++;
          start = i;
          break;
        } else {
          i++;
        }
      }
    } else {
      i++;
    }
  }
  next();
  col.length && rows.push(col.join(''));
  rows.length && lines.push(rows);
  return lines;
};
