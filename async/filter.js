const iterateeNormalize = require('../iterateeNormalize');
const isArray = require('../isArray');
const entries = require('../entries');
const fromPairs = require('../fromPairs');
const {
  resolve: cancelablePromiseResolve,
} = require('../CancelablePromise');
const filterEach = require('./filterEach');


module.exports = (collection, iteratee, output, ctx) => {
  return collection ? (
    iteratee = iterateeNormalize(iteratee),
    isArray(output) || isArray(collection)
      ? filterEach(collection, iteratee, output || [], ctx)
      : filterEach(entries(collection), (line) => {
        return iteratee.call(ctx, line[1], line[0], collection);
      }, []).then((_entries) => fromPairs(_entries, output))
  ) : cancelablePromiseResolve(output || []);
};
