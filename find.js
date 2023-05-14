/**
 * @overview find
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 */

const iterateeNormalize = require('./iterateeNormalize');
const isArray = require('./isArray');
const findIn = require('./findIn');
const findEach = require('./findEach');


module.exports = (collection, iteratee, ctx, hasArray) => {
  return collection && (hasArray || isArray(collection) ? findEach : findIn)(
      collection, iterateeNormalize(iteratee), ctx);
};
