const isEmitter = require('../isEmitter');
const Emitter = require('./index');

module.exports = (value, methods, defaultValue) => {
  return (isEmitter(value) ? value : new Emitter(value, defaultValue))
      .behave(methods);
};
