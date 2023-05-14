const entries = require('../../entries');
const isArray = require('../../isArray');
const isFunction = require('../../isFunction');
const noopHandle = require('../../noopHandle');
const getterProvider = require('../../get').getter;
const reduceEach = require('./reduceEach');


module.exports = (
    collection, iteratee, accumulator, ctx, hasArray, taskLimit,
) => {
  isFunction(iteratee) || (iteratee = getterProvider(iteratee) || noopHandle);
  return hasArray || isArray(collection)
    ? reduceEach(collection, iteratee, accumulator, ctx, taskLimit)
    : reduceEach(entries(collection), (line) => {
      return iteratee.call(ctx, accumulator, line[1], line[0], collection);
    }, accumulator, ctx, taskLimit);
};
