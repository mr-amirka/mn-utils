const REGEXP_CHAR = /[\\^$.*+?()[\]{}|]/gim;

module.exports = (v) => v.replace(REGEXP_CHAR, '\\$&');
