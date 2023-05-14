/**
 * @overview filter
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 */

const iterateeNormalize = require('./iterateeNormalize');
const isArray = require('./isArray');
const filterEach = require('./filterEach');
const filterIn = require('./filterIn');


module.exports = (collection, iteratee, output, ctx) => {
  return (isArray(output) || isArray(collection) ? filterEach : filterIn)(
      collection, iterateeNormalize(iteratee), output, ctx);
};
