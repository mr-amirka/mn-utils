// eslint-disable-next-line
const regexpStripTags = /(<[A-Za-z0-9]+('[^']+'|"[^"]+"|[^>])*\/?>|<\/[A-Za-z0-9]+>)/g;
const regexpSpace = /\s+/g;
const regexpTrim = /^\s+|\s+$/g;
function __replace(v, from, to) {
  return v.replace(from, to);
}

module.exports = (v) => v && __replace(__replace(
    __replace(v, regexpStripTags, ' '), regexpTrim, '',
), regexpSpace, ' ');
