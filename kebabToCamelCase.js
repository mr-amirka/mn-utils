const delimiterToCamelCase = require('./delimiterToCamelCase');

module.exports = (v) => delimiterToCamelCase(v, '-');
