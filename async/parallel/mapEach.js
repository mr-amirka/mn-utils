const {
  resolve: cancelablePromiseResolve,
} = require('../../CancelablePromise');
const loopParallel = require('./loop');


module.exports = (input, iteratee, output, ctx, taskLimit) => {
  const length = input && input.length || 0;
  let index = 0;
  output || (output = new Array(length));
  return loopParallel(() => index < length, () => {
    const i = index++;
    return cancelablePromiseResolve(iteratee.call(ctx, input[i], i, input))
        .then((item) => {
          output[i] = item;
        });
  }, taskLimit).then(() => output);
};
