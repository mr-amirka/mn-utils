const camelToDelimiterCase = require('./camelToDelimiterCase');

module.exports = (v) => camelToDelimiterCase(v, '_');
