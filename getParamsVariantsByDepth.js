/**
 * @overview getParamsVariantsByDepth
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 */
const entries = require('./entries');
const map = require('./map');
const size = require('./size');
const forEach = require('./forEach');
const forIn = require('./forIn');
const setBase = require('./set').base;
const getBase = require('./get').base;
const cloneDepth = require('./cloneDepth');
const isPlainObject = require('./isPlainObject');


const MIN_PARTS_LIMIT = 2;


function paramPrepareIteratee(value) {
  if (!isPlainObject(value)) {
    return value;
  }

  const min = value.min || 0;
  const max = value.max || 1;
  const depthLimit = value.depthLimit || 10;
  const middle = value.middle || ((max - min) * 0.5);
  const startRange = value.startRange || false;

  return {
    ...value,
    startRange,
    depthLimit,
    depth: 0,
    middle,
    min,
    max: startRange
      ? (middle - min) * 2
      : max,
  };
}

function toParamsItems(params) {
  return map(entries(params), (option) => {
    const key = option[0];
    return [key.split('.'), option[1], key];
  });
}

module.exports = (options) => {
  return new Promise((resolve, reject) => {
    const {
      callback,
    } = options;
    const partsLimit = Math.max(MIN_PARTS_LIMIT, options.partsLimit || MIN_PARTS_LIMIT);
    const partsLength = partsLimit + 1;
    const partSize = 1 / partsLength;
    const lastIterationData = options.lastIterationData || {};
    const iterationLimit = options.iterationLimit || 0;
    const params = lastIterationData.params || map(options.params, paramPrepareIteratee, {});
    const paramsItems = toParamsItems(params);

    function getParams(input) {
      const output = {};
      forEach(paramsItems, (item) => {
        output[item[2]] = getBase(input, item[0]);
      });
      return output;
    }

    run({
      ...lastIterationData,
      params,
      index: lastIterationData.index || 0,
      variants: lastIterationData.variants || getVariants(paramsItems),
      prevResults: lastIterationData.prevResults || [],
    });

    function run(iterationData) {
      const {
        index,
      } = iterationData;
      if (index >= iterationLimit) {
        resolve(iterationData.prevResults);
        return;
      }
      Promise.resolve(iterationData).then(callback).then((results) => {
        results.sort((a, b) => b[1] - a[1]);

        const topParamsItems = map(results.slice(0, Math.ceil(results.length * 0.5)), (result) => {
          return getParams(result[0]);
        });
        
        const paramsCountMap = {};

        forEach(topParamsItems, (params) => {
          forIn(params, (value, key) => {
            const param = paramsCountMap[key] || (paramsCountMap[key] = {});
            param[value] = (param[value] || 0) + 1;
          });
        });

        const paramsCountItems = map(entries(paramsCountMap), (line) => {
          return [line[0], size(line[1])];
        });

        paramsCountItems.sort((a, b) => a[1] - b[1]);

        const paramsCountItemsLength = paramsCountItems.length;

        const topParams = topParamsItems[0];
        const params = {
          ...iterationData.params,
        };

        for (let startRange, range, step, min, max, param, depth, value, key, i = 0; i < paramsCountItemsLength; i++) {
          key = paramsCountItems[i][0];
          param = params[key];

          if (!isPlainObject(param)) {
            continue;
          }

          depth = param.depth + 1;
          if (depth > param.depthLimit) {
            continue;
          }

          value = topParams[key];
          range = param.max - param.min;
          step = range * partSize;
          min = value - step;
          max = value + step;
          startRange = param.startRange;

          if (startRange) {
            if (value > param.middle) {
              max = value + range;
            } else{
              startRange = false;
            }
          }


          params[key] = {
            ...param,
            startRange,
            depth,
            middle: value,
            min,
            max,
          };


          run({
            ...iterationData,
            params,
            variants: getVariants(toParamsItems(params)),
            index: index + 1,
            prevResults: results,
          });

          return;
        }

        resolve(results);

      }, reject);
    }

    function getVariants(optionsItems) {
      const optionsItemsLength = optionsItems.length;
      const paramsItems = [];
    
      base({}, 0);
    
      return paramsItems;
    
      function base(params, level, path, value) {
        params = cloneDepth(params, 10);
        path && setBase(params, path, value);
    
        if (level == optionsItemsLength) {
          paramsItems.push(params);
          return;
        }
        const option = optionsItems[level];
        const optionValue = option[1];
        path = option[0];
        level++;
        if (!isPlainObject(optionValue)) {
          base(params, level, path, optionValue);
          return;
        }
    
        const min = optionValue.min;
        const max = optionValue.max;
        const step = (max - min) * partSize;  
        for (let i = 0; i < partsLimit; i++) {
          base(params, level, path, min + (i + 1) * step);
        }
      }
    }

  });
};
