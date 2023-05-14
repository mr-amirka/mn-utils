const forEach = require('./forEach');
const forIn = require('./forIn');
const isArray = require('../isArray');


module.exports = (collection, iteratee, ctx) => {
  return (isArray(collection) ? forEach : forIn)(
      collection, iteratee, ctx);
};
