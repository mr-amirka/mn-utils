const eachApply = require('./eachApply');
module.exports = (funcs, aggregator) => {
  aggregator || (aggregator = eachApply);
  return function() {
    return aggregator(funcs, arguments, this); // eslint-disable-line
  };
};
