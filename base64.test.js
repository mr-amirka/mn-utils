const {
  bytesToBase64,
  base64ToBytes,
  base64encode,
  base64decode,
} = require('./base64');


describe('base64', () => {
  test('bytesToBase64', () => {
    expect(bytesToBase64([86, 97, 115, 121, 97])).toBe('VmFzeWE=');

    expect(bytesToBase64([208, 146, 208, 176, 209, 129, 209, 143, 33]))
        .toBe('0JLQsNGB0Y8h');
  });

  test('base64ToBytes', () => {
    expect(base64ToBytes('VmFzeWE='))
        .toEqual(new Uint8Array([86, 97, 115, 121, 97]));

    expect(base64ToBytes('0JLQsNGB0Y8h'))
        .toEqual(new Uint8Array([208, 146, 208, 176, 209, 129, 209, 143, 33]));
  });

  test('base64encode', () => {
    expect(base64encode('Vasya')).toBe('VmFzeWE=');
    expect(base64encode('Вася!')).toBe('0JLQsNGB0Y8h');
  });

  test('base64decode', () => {
    expect(base64decode('VmFzeWE=')).toBe('Vasya');
    expect(base64decode('0JLQsNGB0Y8h')).toBe('Вася!');
  });
});
