const {
  resolve: cancelablePromiseResolve,
} = require('../../CancelablePromise');
const filterEach = require('../../filterEach');
const loopParallel = require('./loop');


module.exports = (items, iteratee, output, ctx, taskLimit) => {
  const length = items && items.length || 0;
  const filtered = new Array(length);
  let index = 0;
  return loopParallel(() => index < length, () => {
    const i = index++;
    const item = items[i];
    return cancelablePromiseResolve(iteratee.call(ctx, item, i, collection))
        .then((add) => {
          filtered[i] = add;
        });
  }, taskLimit).then(() => {
    return filterEach(items, (item, i) => filtered[i]);
  });
};
