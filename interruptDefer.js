const delay = require('./delay');
const defer = require('./defer');
const INTERRUPT_INDEX = 1000;
let index = 0;
module.exports = (fn, args, ctx) => {
  return index > INTERRUPT_INDEX
    ? (index = 0, delay(fn, 0, args, ctx))
    : (index++, defer(fn, args, ctx));
};
