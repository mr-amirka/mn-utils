const eachApply = require('./eachApply');
module.exports = (subscriptions) => () => {
  const _subscriptions = subscriptions;
  if (_subscriptions) {
    subscriptions = null;
    eachApply(_subscriptions);
  }
};
