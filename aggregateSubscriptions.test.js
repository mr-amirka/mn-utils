const aggregateSubscriptions = require('./aggregateSubscriptions');

describe('aggregateSubscriptions', () => {
  // eslint-disable-next-line
  test('it should aggregates an array of cancel subscription functions', async () => {
    let count = 0;
    const childSubscription = () => {
      count++;
    };
    const subscription = aggregateSubscriptions([
      childSubscription,
      childSubscription,
      childSubscription,
    ]);

    expect(count).toBe(0);
    subscription();
    expect(count).toBe(3);
    subscription();
    expect(count).toBe(3);
  });
});
