const aggregate = require('./aggregate');

describe('aggregate | aggregate functions array into one function', () => {
  test('with outputs array', async () => {
    const outputs = [];
    const aggregateFn = aggregate([
      (a, b) => {
        outputs.push(a + b);
      },
      (a, b) => {
        outputs.push(a * b);
      },
      (a, b) => {
        outputs.push(a - b);
      },
      (a, b) => {
        outputs.push(b - a);
      },
    ]);

    expect(outputs).toEqual([]);
    aggregateFn(5, 7);
    expect(outputs).toEqual([12, 35, -2, 2]);
  });

  test('with this', async () => {
    const self = {
      v: 0,
    };
    const aggregateFn = aggregate([
      function(v) {
        this.v += 2 * v;
      },
      function(v) {
        this.v += 5 * v;
      },
      function(v) {
        this.v += v;
      },
    ]);

    expect(self.v).toEqual(0);
    aggregateFn.call(self, 2);
    expect(self.v).toEqual(16);
  });
});
