module.exports = (node, eventName, document) => {
  let event;
  if (document.createEvent) {
    event = document.createEvent('HTMLEvents');
    event.initEvent(eventName, true, true);
    event.eventName = eventName;
    node.dispatchEvent(event);
  } else {
    event = document.createEventObject();
    event.eventName = event.eventType = eventName;
    node.fireEvent('on' + eventName, event);
  }
};
