const {
  intval,
  floatval,
} = require('./anyval');


describe('anyval', () => {
  test('it should converts a value to an integer', async () => {
    expect(intval('Vasya')).toBe(0);
    expect(intval('Vasya', 3)).toBe(3);
    expect(intval('Vasya', 3, 0)).toBe(3);
    expect(intval('Vasya', 3, -2)).toBe(3);
    expect(intval('Vasya', -5)).toBe(-5);
    expect(intval('Vasya', -5, -2)).toBe(-5);
    expect(intval('10')).toBe(10);
    expect(intval('5.8')).toBe(5);
    expect(intval('5.4')).toBe(5);
    expect(intval('10', 5)).toBe(10);
    expect(intval('10', 5, 0)).toBe(10);
    expect(intval('10', 5, 1)).toBe(10);
    expect(intval('0', 5, 1)).toBe(1);
    expect(intval('-4', 5, 1)).toBe(1);
    expect(intval('-4', 5, -2)).toBe(-2);
    expect(intval('-10')).toBe(-10);
    expect(intval('-10', 7)).toBe(-10);
    expect(intval('-10', 7, 0)).toBe(0);
    expect(intval('20', 7, 0)).toBe(20);
    expect(intval('20', 7, 0, 30)).toBe(20);
    expect(intval('20', 7, 0, 10)).toBe(10);
    expect(intval('-20', 7, 0, 10)).toBe(0);
    expect(intval('dsasd', 7, 0, 10)).toBe(7);
    expect(intval('dsasd', 20, 0, 10)).toBe(20);
    expect(intval('dsasd', -20, 0, 10)).toBe(-20);

    try {
      intval(0, 0, '-20');
      expect(false).toBe(true);
    } catch (e) {}
    try {
      intval(10, 0, {});
      expect(false).toBe(true);
    } catch (e) {}
    try {
      intval(-1, 0, 0, 'dsd');
      expect(false).toBe(true);
    } catch (e) {}
  });

  test('it should converts a value to an float', async () => {
    expect(floatval('Vasya')).toBe(0);
    expect(floatval('Vasya', 3.89)).toBe(3.89);
    expect(floatval('Vasya', 3.78, 0)).toBe(3.78);
    expect(floatval('Vasya', 3, -2)).toBe(3);
    expect(floatval('10.89')).toBe(10.89);
    expect(floatval('9.09', 5)).toBe(9.09);
    expect(floatval('9.09', 5, 0)).toBe(9.09);
    expect(floatval('9.09', 5, 1)).toBe(9.09);
    expect(floatval('0.1', 5, 1)).toBe(1);
    expect(floatval('-4.94', 5, 1)).toBe(1);
    expect(floatval('-4.08', 5, -2)).toBe(-2);
    expect(floatval('-10.87')).toBe(-10.87);
    expect(floatval('-10.87', 7)).toBe(-10.87);
    expect(floatval('-10.87', 7, 0)).toBe(0);
    expect(floatval('20.87', 7, 0)).toBe(20.87);
    expect(floatval('20.6', 7, 0, 30)).toBe(20.6);
    expect(floatval('20.6', 7, 0, 10)).toBe(10);
    expect(floatval('-20.6', 7, 0, 10)).toBe(0);
    expect(floatval('dsasd', 7, 0, 10)).toBe(7);
    expect(floatval('dsasd', 20.6, 0, 10)).toBe(20.6);
    expect(floatval('dsasd', -20.6, 0, 10)).toBe(-20.6);
  });
});
