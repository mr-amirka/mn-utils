const isArray = require('./isArray');
const isMatch = require('./isMatch');
const isFunction = require('./isFunction');
const everyEach = require('./everyEach');
const everyIn = require('./everyIn');


module.exports = (collection, identity, ctx, hasArray) => {
  return (hasArray || isArray(collection) ? everyEach : everyIn)(
      collection,
      isFunction(identity) ? identity : ((v) => isMatch(v, identity)),
      ctx,
  );
};
