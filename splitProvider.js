const __split = ''.split;
module.exports = (delimeter) => (src) => __split.call(src, delimeter);
