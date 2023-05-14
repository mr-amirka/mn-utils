const filter = require('./filter');
const keys = require('./keys');

module.exports = (flags) => keys(filter(flags));
