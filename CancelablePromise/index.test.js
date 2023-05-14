const CancelablePromise = require('./index');

const DEFAULT_TIMEOUT = 100;

describe('CancelablePromise', () => {
  test('rejected resolve', async () => {
    let _subject;
    (new CancelablePromise((resolve) => {
      resolve(CancelablePromise.reject(new Error('Error')));
    })).catch((subject) => {
      _subject = subject;
    });

    await CancelablePromise.delay(1000);
    expect(_subject).toEqual(new Error('Error'));
  });

  test('next resolved', async () => {
    let _delayedSubject;
    let _error;
    let cancelablePromise = CancelablePromise.all([
      CancelablePromise.delay(1000, 'delayed').then((subject) => {
        return _delayedSubject = subject;
      }),
      CancelablePromise.delay(10).then(() => {
        throw new Error('Error1');
      }),
    ]);
    cancelablePromise = cancelablePromise.catch((error) => {
      return _error = error;
    });

    expect(await cancelablePromise).toEqual(new Error('Error1'));
    expect(_error).toEqual(new Error('Error1'));
    expect(_delayedSubject).toBe(undefined);
    await CancelablePromise.delay(1000);
    expect(_delayedSubject).toBe('delayed');
  });

  test('next canceled', async () => {
    let _delayedSubject;
    let _error;
    let cancelablePromise = CancelablePromise.all([
      CancelablePromise.delay(1000, 'delayed').then((subject) => {
        return _delayedSubject = subject;
      }),
      CancelablePromise.delay(10).then(() => {
        throw new Error('Error');
      }),
    ]);
    cancelablePromise = cancelablePromise.catch((error) => {
      return _error = error;
    });

    cancelablePromise.cancel();

    await CancelablePromise.delay(50);
    expect(_error).toEqual(undefined);
    expect(_delayedSubject).toBe(undefined);
    await CancelablePromise.delay(1000);
    expect(_delayedSubject).toBe(undefined);
  });

  test('it should resolve promise', async () => {
    const cancelablePromise = new CancelablePromise((resolve) => {
      resolve(10);
    });
    expect(await cancelablePromise).toBe(10);
  });

  test('it should reject promise', async () => {
    const cancelablePromise = new CancelablePromise((resolve, reject) => {
      reject(new Error('1 Ooops!'));
    });
    const promise = new Promise((resolve) => {
      cancelablePromise.catch(resolve);
    });
    expect(await promise).toEqual(new Error('1 Ooops!'));
  });

  test('it should cancel promise', async () => {
    const promise = new Promise((topResolve, topReject) => {
      let cancelCount = 0;
      const cancelablePromise = new CancelablePromise((resolve) => {
        resolve(10);
      }).then(
          () => {
            topReject(new Error('promise "then" resolve callback executed'));
          },
          () => {
            topReject(new Error('promise "then" reject callback executed'));
          },
          () => {
            cancelCount++;
          },
      );
      cancelablePromise.cancel();

      setTimeout(() => {
        topResolve(cancelCount);
      }, DEFAULT_TIMEOUT);
    });
    expect(await promise).toEqual(1);
  });

  test('it should add cancel event listener', async () => {
    return new Promise((topResolve, topReject) => {
      const cancelablePromise = new CancelablePromise((resolve) => {
        resolve(10);
      });
      cancelablePromise
          .then(() => {
            topReject(new Error('promise "then" callback executed'));
          })
          .onCancel(topResolve)
          .cancel();
    });
  });

  test('"onCancel" as "then" args', async () => {
    return new Promise((topResolve, topReject) => {
      const cancelablePromise = new CancelablePromise((resolve) => {
        resolve(10);
      });
      cancelablePromise.then(
          // then
          () => {
            topReject(new Error('promise "then" callback executed'));
          },
          // catch
          null,
          // cancel
          topResolve,
      ).cancel();
    });
  });

  test('it should cancel promise if canceled all child promises', async () => {
    return new Promise((topResolve, topReject) => {
      const cancelablePromise = CancelablePromise.resolve('Hello!');
      const childCancelablePromise1 = cancelablePromise.then(() => {
        topReject(new Error('child promise 1 "then" callback executed'));
      });
      const childCancelablePromise2 = cancelablePromise.then(() => {
        topReject(new Error('child promise 2 "then" callback executed'));
      });
      const childCancelablePromise3 = cancelablePromise.then(() => {
        topReject(new Error('child promise 3 "then" callback executed'));
      });
      childCancelablePromise1.cancel();
      childCancelablePromise2.cancel();
      childCancelablePromise3.cancel();

      setTimeout(topResolve, DEFAULT_TIMEOUT);
    });
  });

  /* eslint-disable-next-line */
  test('it should resolve promise if canceled 2 of 3 child promises', async () => {
    return new Promise((topResolve, topReject) => {
      const cancelablePromise = CancelablePromise.resolve('Hello!');
      const childCancelablePromise1 = cancelablePromise.then(() => {
        topReject(new Error('child promise 1 "then" callback executed'));
      });
      const childCancelablePromise2 = cancelablePromise.then(() => {
        topReject(new Error('child promise 2 "then" callback executed'));
      });
      cancelablePromise.then((val) => {
        expect(val).toBe('Hello!');
        topResolve();
      });
      childCancelablePromise1.cancel();
      childCancelablePromise2.cancel();
    });
  });

  test('it should extract inner promise', async () => {
    const cancelablePromise = new CancelablePromise((resolve) => {
      const innerCancelablePromise = new CancelablePromise((resolve) => {
        resolve('resolved');
      });
      resolve(innerCancelablePromise);
    }).then((value) => {
      return new CancelablePromise((resolve) => {
        resolve(value + ' promise');
      });
    });
    expect(await cancelablePromise).toBe('resolved promise');
  });

  test('it should execute "finally" callback if resolved promise', async () => {
    const promise = new Promise((topResolve, topReject) => {
      const cancelablePromise = new CancelablePromise((resolve) => {
        resolve('Hello world!');
      });
      cancelablePromise
          .then((v) => {
            return v + '!';
          })
          .then((v) => {
            return v + '!';
          })
          .finally((error, val, canceled) => {
            topResolve([error, val, canceled]);
          });
    });
    expect(await promise).toEqual([null, 'Hello world!!!', false]);
  });

  test('it should execute "finally" callback if rejected promise', async () => {
    const cancelablePromise = new CancelablePromise((resolve, reject) => {
      reject(new Error('2 Ooops!'));
    });
    const childCancelablePromise = cancelablePromise.finally((error, val) => {
      expect(val).toBe(null);
      expect(error).toEqual(new Error('2 Ooops!'));
    });
    const childCancelablePromise2 = childCancelablePromise.catch((v) => v);
    expect(await childCancelablePromise2).toEqual(new Error('2 Ooops!'));
  });

  test('it should execute "finally" callback if canceled promise', async () => {
    const promise = new Promise((topResolve, topReject) => {
      const cancelablePromise = new CancelablePromise((resolve) => {
        resolve('resolved');
      }).finally((error, val, canceled) => {
        topResolve([error, val, 'finally', canceled]);
      });
      cancelablePromise.cancel();
    });
    expect(await promise).toEqual([null, null, 'finally', true]);
  });

  /* eslint-disable-next-line */
  test('it should interpreted string as a path if "then" is called with a string', async () => {
    const cancelablePromise = new CancelablePromise((resolve) => {
      resolve({
        name: 'Peter',
        age: 30,
      });
    });
    expect(await cancelablePromise.then('name')).toBe('Peter');
    expect(await cancelablePromise.then('age')).toBe(30);
    expect(await cancelablePromise).toEqual({
      name: 'Peter',
      age: 30,
    });
  });

  /* eslint-disable-next-line */
  test('it should interpreted string as a deep path if "then" is called with a string', async () => {
    const cancelablePromise = CancelablePromise.resolve({
      persons: [
        {name: 'Vasya', age: 40, child: {name: 'Volodya', age: 20}},
        {name: 'Kate', age: 30, child: {name: 'Ann', age: 12}},
      ],
    });
    expect(await cancelablePromise.then('persons.0'))
        .toEqual({name: 'Vasya', age: 40, child: {name: 'Volodya', age: 20}});
    expect(await cancelablePromise.then('persons.0.age')).toBe(40);
    expect(await cancelablePromise.then('persons.1.child'))
        .toEqual({name: 'Ann', age: 12});
    expect(await cancelablePromise.then('persons.1.child.name')).toBe('Ann');
  });

  /* eslint-disable-next-line */
  test('it should return parent value if parent promise "then" is called with empty args', async () => {
    const cancelablePromise = new CancelablePromise((resolve) => {
      resolve({
        name: 'Michael',
        age: 24,
      });
    });
    expect(await cancelablePromise.then()).toEqual({
      name: 'Michael',
      age: 24,
    });
    expect(await cancelablePromise).toEqual({
      name: 'Michael',
      age: 24,
    });
  });

  test('it should be executed without call "then"', async () => {
    return new Promise((topResolve, topReject) => {
      new CancelablePromise((resolve) => {
        resolve('resolved');
        topResolve();
      });
    });
  });

  test('it should be executed with call "then"', async () => {
    return new Promise((topResolve) => {
      const cancelablePromise = new CancelablePromise((resolve) => {
        resolve('resolved');
        topResolve();
      });
      cancelablePromise.then();
    });
  });

  test('it should defer callback and return cancelable promise', async () => {
    const order = [];
    const cancelablePromise = CancelablePromise
        .defer()
        .then(() => {
          order.push(2);
          return 'Hello';
        })
        .then((v) => v + ' Vasya!');
    order.push(1);
    expect(await cancelablePromise).toBe('Hello Vasya!');
    expect(order).toEqual([1, 2]);
  });

  test('it should defer callback and cancel it', async () => {
    const order = [];
    CancelablePromise
        .defer(() => {
          order.push(2);
          return 'Hello';
        })
        .then((v) => v + ' Vasya!')
        .cancel();
    order.push(1);
    const promise = new Promise((resolve) => {
      setTimeout(resolve, DEFAULT_TIMEOUT, order);
    });
    expect(await promise).toEqual([1]);
  });

  test('it should delay callback and return cancelable promise', async () => {
    const order = [];
    const cancelablePromise = CancelablePromise
        .delay(100, 'Hi')
        .then((v) => {
          order.push(3);
          return v + ' Peter!';
        });
    order.push(1);
    setTimeout(() => {
      order.push(2);
    }, 50);
    expect(await cancelablePromise).toBe('Hi Peter!');
    expect(order).toEqual([1, 2, 3]);
  });

  test('it should delay callback and cancel it', async () => {
    const order = [];
    CancelablePromise
        .delay(100, 'Hi')
        .then((v) => {
          order.push(3);
          return v + ' Peter!';
        })
        .cancel();
    order.push(1);
    setTimeout(() => {
      order.push(2);
    }, 50);
    const promise = new Promise((resolve) => {
      setTimeout(resolve, 200, order);
    });
    expect(await promise).toEqual([1, 2]);
  });

  test('it should provide new CancelablePromise instance', async () => {
    const cancelablePromise = CancelablePromise.provide((resolve) => {
      resolve('Meow!');
    });
    expect(await cancelablePromise).toBe('Meow!');
  });

  /* eslint-disable-next-line */
  test('it should success call method "all" with array of the promises', async () => {
    const cancelablePromise = CancelablePromise.all([
      CancelablePromise.resolve('Vasya'),
      CancelablePromise.resolve('Volodya'),
      CancelablePromise.resolve('Peter'),
      CancelablePromise.resolve('Samat'),
    ]);
    expect(await cancelablePromise).toEqual([
      'Vasya', 'Volodya', 'Peter', 'Samat',
    ]);
  });

  /* eslint-disable-next-line */
  test('it should success call method "all" with array with any value', async () => {
    const cancelablePromise = CancelablePromise.all([
      'Vasya',
      'Peter',
      CancelablePromise.resolve('Volodya'),
      {name: 'Kate'},
      CancelablePromise.resolve('Samat'),
      321,
    ]);
    expect(await cancelablePromise).toEqual([
      'Vasya', 'Peter', 'Volodya', {name: 'Kate'}, 'Samat', 321,
    ]);
  });

  /* eslint-disable-next-line */
  test('it should success call method "all" with object with any props', async () => {
    const cancelablePromise = CancelablePromise.all({
      name: 'Vasya',
      teeth: 3,
      age: CancelablePromise.resolve(60),
      child: CancelablePromise.resolve({
        name: 'Ann',
      }),
    });
    expect(await cancelablePromise).toEqual({
      name: 'Vasya',
      teeth: 3,
      age: 60,
      child: {
        name: 'Ann',
      },
    });
  });

  test('it should fail if call method "all" with string', async () => {
    let hasError;
    try {
      CancelablePromise.all('3 Ooops');
    } catch (e) {
      hasError = true;
    }
    expect(hasError).toBe(true);
  });

  test('it should fail if call method "all" with number', async () => {
    let hasError;
    try {
      CancelablePromise.all(33);
    } catch (e) {
      hasError = true;
    }
    expect(hasError).toBe(true);
  });

  test('it should fail if call method "all" with null', async () => {
    let hasError;
    try {
      CancelablePromise.all(null);
    } catch (e) {
      hasError = true;
    }
    expect(hasError).toBe(true);
  });

  test('it should fail if call method "all" with boolean', async () => {
    let hasError1;
    try {
      CancelablePromise.all(true);
    } catch (e) {
      hasError1 = true;
    }
    expect(hasError1).toBe(true);

    let hasError2;
    try {
      CancelablePromise.all(false);
    } catch (e) {
      hasError2 = true;
    }
    expect(hasError2).toBe(true);
  });

  /* eslint-disable-next-line */
  test('it should cancel all child promises if cancel aggregate promise which returned by method "all"', async () => {
    return new Promise((topResolve, topReject) => {
      const cancelablePromise1 = CancelablePromise.resolve().then(() => {
        topReject(new Error('promise 1 initialization executed'));
        return 1;
      });
      const cancelablePromise2 = CancelablePromise.resolve().then(() => {
        topReject(new Error('promise 2 initialization executed'));
        return 2;
      });
      const cancelablePromise3 = CancelablePromise.resolve().then(() => {
        topReject(new Error('promise 3 initialization executed'));
        return 3;
      });
      const aggregateCancelablePromise = CancelablePromise.all([
        cancelablePromise1,
        cancelablePromise2,
        cancelablePromise3,
      ]).then(() => {
        topReject(new Error('aggregate promise "then" callback executed'));
      });

      aggregateCancelablePromise.cancel();

      setTimeout(topResolve, DEFAULT_TIMEOUT);
    });
  });

  /* eslint-disable-next-line */
  test('it should resolve first value when call "race" with array of the promises', async () => {
    const cancelablePromise = CancelablePromise.race([
      CancelablePromise.delay(200, 'one'),
      CancelablePromise.delay(100, 'two'),
      CancelablePromise.delay(50, 'three'),
      CancelablePromise.delay(500, 'four'),
    ]);
    expect(await cancelablePromise).toBe('three');
  });

  test('"race" with array with any value', async () => {
    const cancelablePromise = CancelablePromise.race([
      'Vasya',
      CancelablePromise.delay(50, 'Pawel'),
      CancelablePromise.delay(500, 'Mary'),
      321,
    ]);
    expect(await cancelablePromise).toBe('Vasya');
  });

  test('"race" if reject all promises in race', async () => {
    const promise = new Promise((topResolve, topReject) => {
      CancelablePromise.race([
        CancelablePromise.delay(500, 'one', true),
        CancelablePromise.delay(50, 'two2', true),
        CancelablePromise.delay(100, 'three', true),
        CancelablePromise.delay(250, 'four', true),
      ]).then(
          () => {
            topReject(new Error('"then" callback executed'));
          },
          topResolve,
          () => {
            topReject(new Error('"then" callback on cancel executed'));
          },
      );
    });
    expect(await promise).toEqual('two2');
  });
});
