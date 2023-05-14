const forEachAsync = require('./forEach');
const entries = require('../entries');


module.exports = (collection, fn, ctx) => {
  return forEachAsync(entries(collection), (line) => {
    return fn.call(ctx, line[1], line[0], collection);
  }, ctx);
};
