const isNumber = require('../isNumber');
const asyncInterval = require('../async/interval');
const {
  v4: uuidv4,
} = require('uuid');

const DEFAULT_CHECK_INTERVAL = 30000;
const DEFAULT_MAX_AGE = 86400000;


module.exports = (settings) => {
  settings = settings || {};
  const maxAge = settings.maxAge || DEFAULT_MAX_AGE;
  const checkInterval = settings.checkInterval || DEFAULT_CHECK_INTERVAL;

  if (!isNumber(maxAge) || maxAge < 0) {
    throw new Error('Param "maxAge" is invalid');
  }
  if (!isNumber(checkInterval) || checkInterval < 0) {
    throw new Error('Param "checkInterval" is invalid');
  }

  const _state = {};

  asyncInterval(() => {
    const time = (new Date()).getTime();
    let k, v; // eslint-disable-line
    for (k in _state) { // eslint-disable-line
      v = _state[k];
      if (v[0] < time) {
        delete _state[k];
      }
    }
  }, checkInterval);

  function setAll(sessionId, sessionObj) {
    const currentTime = (new Date()).getTime();
    const expires = currentTime + maxAge;
    _state[sessionId] = [expires, sessionObj];
    return self;
  }
  function getAll(sessionId) {
    const item = _state[sessionId];
    return item ? item[1] : {};
  }
  function set(sessionId, key, value) {
    return setAll(sessionId, {
      ...getAll(sessionId),
      [key]: value,
    });
  }
  function get(sessionId, key) {
    return getAll(sessionId)[key];
  }
  function remove(sessionId) {
    delete _state[sessionId];
    return self;
  }
  function getNewSessionId(sessionObj) {
    let sessionId = uuidv4();
    while (_state[sessionId]) {
      sessionId = uuidv4();
    }
    setAll(sessionId, sessionObj);
    return sessionId;
  }
  const self = {
    getNewSessionId,
    setAll,
    getAll,
    remove,
    set,
    get,
  };

  return self;
};
