const {
  resolve: cancelablePromiseResolve,
} = require('../CancelablePromise');
const loopAsync = require('./loop');


module.exports = (input, iteratee, output, ctx) => {
  const length = input && input.length || 0;
  let index = 0;
  output || (output = new Array(length));
  return loopAsync(() => index < length, () => {
    const i = index++;
    return cancelablePromiseResolve(iteratee.call(ctx, input[i], i, input))
        .then((item) => {
          output[i] = item;
        });
  }).then(() => output);
};
