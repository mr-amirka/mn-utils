const _global = require('./_global');

test('_global contains Array', () => {
  expect(_global.Array).toBe(Array);
});
test('_global contains Promise', () => {
  expect(_global.Promise).toBe(Promise);
});
test('_global contains Object', () => {
  expect(_global.Object).toBe(Object);
});
test('_global contains Math', () => {
  expect(_global.Math).toBe(Math);
});
