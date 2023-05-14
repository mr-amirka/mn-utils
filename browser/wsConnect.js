const CancelablePromise = require('../CancelablePromise');


module.exports = (wsUrl) => {
  return new CancelablePromise((resolve, reject) => {
    const socket = new WebSocket(wsUrl);
    socket.onopen = () => {
      socket.onclose = socket.onerror = null;
      resolve(socket);
    };
    socket.onclose = socket.onerror = reject;
    return () => {
      socket.close(1000, 'Connection closed');
    };
  });
};
