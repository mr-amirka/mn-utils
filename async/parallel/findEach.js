const {
  resolve: cancelablePromiseResolve,
} = require('../../CancelablePromise');
const loopAsync = require('./loop');


module.exports = (items, iteratee, ctx, taskLimit) => {
  const length = items && items.length || 0;
  let index = 0, _found; // eslint-disable-line
  return loopAsync(() => !_found && index < length, () => {
    const i = index++;
    const item = items[i];
    return cancelablePromiseResolve(iteratee.call(ctx, item, i, collection))
        .then((add) => {
          add && (_found = item);
        });
  }, taskLimit).then(() => _found);
};
