module.exports = (v) => v.replace(regexp, '\\$1');
const regexp = /(["\\])/g;
