const regexp = /^\+7\(\d{3}\)\d{3}-\d{2}-\d{2}$/i;
module.exports = (v) => v && regexp.test(v);
