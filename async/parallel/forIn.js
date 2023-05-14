const entries = require('../../entries');
const forEachParallel = require('./forEach');


module.exports = (collection, fn, ctx, taskLimit) => {
  return forEachParallel(entries(collection), (line) => {
    return fn.call(ctx, line[1], line[0], collection);
  }, ctx, taskLimit).then(() => collection);
};
