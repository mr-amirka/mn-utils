const addOf = require('./addOf');

describe('addOf', () => {
  test('it should adds an element if does not already contain it', async () => {
    const arr = [];
    expect(addOf(arr, 1)).toEqual([1]);
    expect(addOf(arr, 2)).toEqual([1, 2]);
    expect(addOf(arr, 5)).toEqual([1, 2, 5]);
    expect(addOf(arr, 3)).toEqual([1, 2, 5, 3]);
    expect(addOf(arr, 1)).toEqual([1, 2, 5, 3]);
    expect(addOf(arr, 2)).toEqual([1, 2, 5, 3]);
    expect(addOf(arr, 3)).toEqual([1, 2, 5, 3]);
    expect(addOf(arr, 4)).toEqual([1, 2, 5, 3, 4]);
    expect(addOf(arr, 5)).toEqual([1, 2, 5, 3, 4]);

    const arrayLikeObject = {length: 0};
    expect(addOf(arrayLikeObject, 10)).toEqual({length: 1, 0: 10});
    expect(addOf(arrayLikeObject, 5)).toEqual({length: 2, 0: 10, 1: 5});
    expect(addOf(arrayLikeObject, 10)).toEqual({length: 2, 0: 10, 1: 5});
    expect(addOf(arrayLikeObject, 4)).toEqual({length: 3, 0: 10, 1: 5, 2: 4});
    expect(addOf(arrayLikeObject, 5)).toEqual({length: 3, 0: 10, 1: 5, 2: 4});
  });
});
