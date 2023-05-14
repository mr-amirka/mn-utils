const bind = require('./bind');


describe('bind', () => {
  test('add args', () => {
    const log = jest.fn();
    const console = {
      log,
    };

    const logInfo = bind(console.log, console, ['info:']);
    expect(log.mock.calls.length).toBe(0);

    logInfo('Хрю!');
    expect(log.mock.calls.length).toBe(1);
    expect(log.mock.calls[0]).toEqual(['info:', 'Хрю!']);
  });

  test('add several args', () => {
    const log = jest.fn();
    const console = {
      log,
    };

    const logBinded = bind(console.log, console, ['a', 'b']);
    expect(log.mock.calls.length).toBe(0);

    logBinded('c', 'd', 'e');
    expect(log.mock.calls.length).toBe(1);
    expect(log.mock.calls[0]).toEqual(['a', 'b', 'c', 'd', 'e']);
  });

  test('context', () => {
    let _ctx = null;
    function log() {
      _ctx = this;
    }
    const console = {
      log,
    };

    const logInfo = bind(console.log, console, ['info:']);
    expect(_ctx).toBe(null);

    logInfo('Ups!');
    expect(_ctx).toBe(console);
  });
});
