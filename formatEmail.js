const regexp = /\s+/g;
module.exports = (v) => 'mailto:' + (v ? v.replace(regexp, '') : '');
