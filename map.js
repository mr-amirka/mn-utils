const isArray = require('./isArray');
const isFunction = require('./isFunction');
const noopHandle = require('./noopHandle');
const mapEach = require('./mapEach');
const mapIn = require('./mapIn');
const getterProvider = require('./get').getter;


module.exports = (collection, iteratee, output, ctx) => {
  return collection
    ? (isArray(output) || isArray(collection) ? mapEach : mapIn)(
        collection,
        isFunction(iteratee)
          ? iteratee
          : getterProvider(iteratee) || noopHandle,
        output,
        ctx,
    )
    : output || [];
};
