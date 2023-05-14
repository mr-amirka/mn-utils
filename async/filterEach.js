const {
  resolve: cancelablePromiseResolve,
} = require('../CancelablePromise');
const loopAsync = require('./loop');


module.exports = (items, iteratee, output, ctx) => {
  const length = items && items.length || 0;
  let index = 0;
  return loopAsync(() => index < length, () => {
    const i = index++;
    const item = items[i];
    return cancelablePromiseResolve(iteratee.call(ctx, item, i, collection))
        .then((add) => {
          add && output.push(item);
        });
  }).then(() => output);
};
