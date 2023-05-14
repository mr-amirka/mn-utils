module.exports = (v) => v.replace(re, replacer);
const re = /(\\\\)|(\\)/g;
function replacer(all, v) {
  return v ? '\\' : '';
}
