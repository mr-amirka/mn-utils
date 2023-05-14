const variants = require('./variants');

describe('variants', () => {
  test('with "P(eter|awel|atrik)"', () => {
    expect(variants('P(eter|awel|atrik)')).toEqual([
      'Peter', 'Pawel', 'Patrik',
    ]);
  });

  test('with "re(build|code)"', () => {
    expect(variants('re(build|code)')).toEqual([
      'rebuild', 'recode',
    ]);
  });

  test('with "(in|de|re)(ject|code)"', () => {
    expect(variants('(in|de|re)(ject|code)')).toEqual([
      'inject', 'incode', 'deject', 'decode', 'reject', 'recode',
    ]);
  });

  test('with "В(олод|ас)я"', () => {
    expect(variants('В(олод|ас)я')).toEqual([
      'Володя', 'Вася',
    ]);
  });

  test('with "V((olod|as)ya|italiy)"', () => {
    expect(variants('V((olod|as)ya|italiy)')).toEqual([
      'Volodya', 'Vasya', 'Vitaliy',
    ]);
  });

  test('with "((|p)re|de|un)(build|cod)(|er|ing)"', () => {
    expect(variants('((|p)re|de|un)(build|cod)(|er|ing)')).toEqual([
      'rebuild', 'rebuilder', 'rebuilding', 'recod', 'recoder', 'recoding',
      'prebuild', 'prebuilder', 'prebuilding', 'precod', 'precoder',
      'precoding',
      'debuild', 'debuilder', 'debuilding', 'decod', 'decoder', 'decoding',
      'unbuild', 'unbuilder', 'unbuilding', 'uncod', 'uncoder', 'uncoding',
    ]);
  });

  test('it should ignore service characters with escaping', () => {
    expect(variants('h\\(ate\\|elp\\) me')).toEqual([
      'h(ate|elp) me',
    ]);
  });
});
