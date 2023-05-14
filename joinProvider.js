
const __join = [].join;
module.exports = (delimeter) => (src) => __join.call(src, delimeter);
