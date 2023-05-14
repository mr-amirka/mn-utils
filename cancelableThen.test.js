const cancelableThen = require('./cancelableThen');
const DEFAULT_TIMEOUT = 200;


describe('cancelableThen', () => {
  test('it should make func of cancel', async () => {
    let result = 0;
    const promise = new Promise((resolve) => {
      setTimeout(resolve, 100, 10);
    });
    const finalPromise = new Promise((resolve) => {
      setTimeout(() => {
        resolve(result);
      }, DEFAULT_TIMEOUT);
    });
    cancelableThen(promise, (v) => {
      result = v;
    });
    expect(await finalPromise).toBe(10);
  });

  test('it should cancel callback', async () => {
    let result = 0;
    const promise = new Promise((resolve) => {
      setTimeout(resolve, 100, 10);
    });
    const finalPromise = new Promise((resolve) => {
      setTimeout(() => {
        resolve(result);
      }, DEFAULT_TIMEOUT);
    });
    const cancel = cancelableThen(promise, (v) => {
      result = v;
    });
    setTimeout(cancel, 50);
    expect(await finalPromise).toBe(0);
  });
});
