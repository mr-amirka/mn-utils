/**
 * @overview getParamsVariants
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 */
const entries = require('./entries');
const map = require('./map');
const setBase = require('./set').base;
const cloneDepth = require('./cloneDepth');
const isArray = require('./isArray');


module.exports = (options) => {
  const optionsItems = map(entries(options), (option) => {
    return [option[0].split('.'), option[1]];
  });
  const optionsItemsLength = optionsItems.length;

  const paramsItems = [];

  base({}, 0);

  return paramsItems;

  function base(params, level, path, value) {
    params = cloneDepth(params, 10);
    path && setBase(params, path, value);

    if (level === optionsItemsLength) {
      paramsItems.push(params);
      return;
    }
    const option = optionsItems[level];
    const range = option[1];
    path = option[0];
    level++;
    if (!isArray(range)) {
      base(params, level, path, range);
      return;
    }

    value = range[0];
    const max = range[1];
    const step = range[2];
    for (; value <= max; value += step) {
      base(params, level, path, value);
    }
  }
};
