const testingAttachEvent = require('./attachEvent');

describe('attachEvent', () => {
  test('it should add event listener in normal browser', async () => {
    const addEventListener = jest.fn();
    const removeEventListener = jest.fn();
    const attachEvent = jest.fn();
    const detachEvent = jest.fn();
    const element = {
      addEventListener,
      removeEventListener,
      attachEvent,
      detachEvent,
    };
    const eventName = 'click';
    const eventHandle = () => {};
    const eventOptions = {};

    const cancel = testingAttachEvent(element, eventName, eventHandle, eventOptions); // eslint-disable-line
    expect(addEventListener.mock.calls[0]).toEqual([
      eventName, eventHandle, eventOptions,
    ]);
    expect(addEventListener.mock.calls.length).toBe(1);
    expect(removeEventListener.mock.calls.length).toBe(0);
    expect(attachEvent.mock.calls.length).toBe(0);
    expect(detachEvent.mock.calls.length).toBe(0);

    cancel();
    expect(addEventListener.mock.calls.length).toBe(1);
    expect(removeEventListener.mock.calls[0]).toEqual([
      eventName, eventHandle, eventOptions,
    ]);
    expect(removeEventListener.mock.calls.length).toBe(1);
    expect(attachEvent.mock.calls.length).toBe(0);
    expect(detachEvent.mock.calls.length).toBe(0);
  });

  test('it should add event listener in ie8', async () => {
    const attachEvent = jest.fn();
    const detachEvent = jest.fn();
    const element = {
      attachEvent,
      detachEvent,
    };
    const eventName = 'mouseup';
    const eventHandle = () => {};
    const eventOptions = {};

    const cancel = testingAttachEvent(element, eventName, eventHandle, eventOptions); // eslint-disable-line
    expect(attachEvent.mock.calls[0]).toEqual([
      'onmouseup', eventHandle,
    ]);
    expect(attachEvent.mock.calls.length).toBe(1);
    expect(detachEvent.mock.calls.length).toBe(0);

    cancel();
    expect(attachEvent.mock.calls.length).toBe(1);
    expect(detachEvent.mock.calls[0]).toEqual([
      'onmouseup', eventHandle,
    ]);
    expect(detachEvent.mock.calls.length).toBe(1);
  });
});
