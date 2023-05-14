const isArray = require('./isArray');
const reduceEach = require('./reduceEach');
const reduceIn = require('./reduceIn');


module.exports = (collection, iteratee, accumulator, ctx, hasArray) => {
  return (hasArray || isArray(collection) ? reduceEach : reduceIn)(
      collection, iteratee, accumulator, ctx);
};
