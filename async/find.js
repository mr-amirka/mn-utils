const iterateeNormalize = require('../iterateeNormalize');
const isArray = require('../isArray');
const entries = require('../entries');
const {
  resolve: cancelablePromiseResolve,
} = require('../CancelablePromise');
const findEach = require('./findEach');


module.exports = (collection, iteratee, ctx) => {
  return collection ? (
    iteratee = iterateeNormalize(iteratee),
    isArray(collection)
      ? findEach(collection, iteratee, ctx)
      : findEach(entries(collection), (line) => {
        return iteratee.call(ctx, line[1], line[0], collection);
      })
  ) : cancelablePromiseResolve();
};
