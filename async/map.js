const {
  resolve: cancelablePromiseResolve,
} = require('../CancelablePromise');
const entries = require('../entries');
const fromPairs = require('../fromPairs');
const isArray = require('../isArray');
const isFunction = require('../isFunction');
const noopHandle = require('../noopHandle');
const getterProvider = require('../get').getter;
const mapEach = require('./mapEach');


module.exports = (collection, iteratee, output, ctx) => {
  return collection ? (
    isFunction(iteratee) || (iteratee = getterProvider(iteratee) || noopHandle),
    isArray(output) || isArray(collection)
      ? mapEach(collection, iteratee, output || [], ctx)
      : mapEach(entries(collection), (line) => {
        return iteratee.call(ctx, line[1], line[0], collection);
      }, [], ctx).then((_entries) => fromPairs(_entries, output))
  ) : cancelablePromiseResolve(output || []);
};
