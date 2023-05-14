const scopeSplit = require('./scopeSplit');

describe('scopeSplit', () => {
  test('example', async () => {
    expect(scopeSplit('not(.disabled(.as).lak).checked', '(', ')'))
        .toEqual([
          'not',
          [
            '.disabled',
            [
              '.as',
            ],
            '.lak',
          ],
          '.checked',
        ]);
  });
});
