/**
 * @overview getParamsVariantsByDepth
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 */
const reduce = require('./reduce');
const getKeys = require('./keys');
const sort = require('./sort');
const mapEach = require('./mapEach');
const forEach = require('./forEach');
const filter = require('./filter');
const setBase = require('./set').base;
const getBase = require('./get').base;
const isPlainObject = require('./isPlainObject');
const isArray = require('./isArray');


const MIN_PARTS_LIMIT = 2;


const ITEM_FIELED_ID = 0;
const ITEM_FIELED_PARENT = 1;
const ITEM_FIELED_DEPTH = 2;
const ITEM_FIELED_DONE = 3;
const ITEM_FIELED_RESULT = 4;
const ITEM_FIELED_AREA = 5;

const AREA_FIELED_MIN = 0;
const AREA_FIELED_MAX = 1;
const AREA_FIELED_VALUE = 2;


function iterateeSort(a, b) {
  return b[ITEM_FIELED_RESULT] - a[ITEM_FIELED_RESULT];
}

module.exports = (options) => {
  options = {...options};
  return new Promise((resolve, reject) => {

    (async () => {
      const {
        callback,
      } = options;
      const partsLimit = Math
          .max(MIN_PARTS_LIMIT, options.partsLimit || MIN_PARTS_LIMIT);
      // const odd = partsLimit % 2;
      const partsLength = partsLimit + 1;
      const partSize = 1 / partsLength;
      const depthLimit = options.depthLimit || 0;
      const paramsArea = options.params;
  
      const storage = options.storage;
      

      const paramsKeys = (await storage.get('paramsKeys')) || getKeys(paramsArea);
      const paramsPaths = mapEach(paramsKeys, (key) => key.split('.'));

      await storage.setAll({
        index: await storage.get('index') || 0,
        paramsArea,
        paramsKeys,
      });

      const resultsOfOrigin = mapEach((await storage.get('results')) || [
        [1, 0, 0, 0, 0, mapEach(paramsKeys, (key) => {
          const value = paramsArea[key];
          if (!isPlainObject(value)) {
            return value;
          }
          const {
            max,
          } = value;
          return [
            value.min || 0,
            typeof max == 'number' ? max : 1,
            0,
          ];
        })],
      ], (item) => {
        const area = item[ITEM_FIELED_AREA];
        if (isPlainObject(area)) {
          item[ITEM_FIELED_AREA] = mapEach(paramsKeys, (key) => area[key]);
        }
        return item;
      }, []);
  
      await storage.set('results', resultsOfOrigin);

      let lastId = Math.max.apply(Math, mapEach(resultsOfOrigin, (item) => item[ITEM_FIELED_ID]));

      iteration();

      function getParams(input) {
        return mapEach(paramsPaths, (path) => {
          return getBase(input, path);
        });
      }

      function iterateeFilter(item) {
        return !(item[ITEM_FIELED_DONE] || item[ITEM_FIELED_DEPTH] >= depthLimit);
      }

      async function iteration() {
        const resultsOfOrigin = await storage.get('results');

        sort(resultsOfOrigin, iterateeSort);

        const topItem = resultsOfOrigin[0];

        storage.set('top', {
          id: topItem[ITEM_FIELED_ID],
          parentId: topItem[ITEM_FIELED_PARENT],
          depth: topItem[ITEM_FIELED_DEPTH],
          done: topItem[ITEM_FIELED_DONE],
          result: topItem[ITEM_FIELED_RESULT],
          params: reduce(topItem[ITEM_FIELED_AREA], (params, area, index) => {
            params[paramsKeys[index]] = area[2];
            return params;
          }, {}),
        });


        const results = filter(resultsOfOrigin, iterateeFilter);

        if (!results.length) {
          resolve(resultsOfOrigin);
          return;
        }

        const parentItem = results[0];
        const parentItemArea = parentItem[ITEM_FIELED_AREA];
        const variants = getVariants(parentItemArea);

        await storage.set('variants', variants);

        const index = await storage.get('index');

        Promise.resolve(storage).then(callback).then(async (results) => {
          sort(results, (a, b) => b[1] - a[1]);

          const parentId = parentItem[ITEM_FIELED_ID];
          const depth = parentItem[ITEM_FIELED_DEPTH] + 1;
          const paramsOfTop = getParams(results[0]);

          parentItem[ITEM_FIELED_DONE] = 1;

          forEach(results, ([params, result]) => {
            resultsOfOrigin.push([
              params._paramsId,
              parentId,
              depth,
              0,
              result,
              mapEach(getParams(params), (value, index) => {
                const parentValueOption = parentItemArea[index];
                if (!isArray(parentValueOption)) {
                  return value;
                }
                const [min, max] = parentValueOption;
                const valueOfTop = paramsOfTop[index];
                const range = max - min;
                const step = range * partSize;

                return valueOfTop == value
                  ? [value - step, value + step, value]
                  : (
                    valueOfTop > value
                    ? [value - step, value, value]
                    : [value, value + step, value]
                  );
              }),
            ]);
          });

          await storage.set('results', resultsOfOrigin);
          await storage.set('index', index + 1);

          iteration();
        });


        function getVariants(paramsArea) {
          const paramsAreaLength = paramsArea.length;
          const paramsItems = [];

          base(new Array(paramsAreaLength), 0);
          
          return mapEach(paramsItems, (params) => {
            const dst = {
              _paramsId: ++lastId,
            };
            forEach(params, (value, index) => {
              setBase(dst, paramsPaths[index], value);
            });
            return dst;
          });

          function base(params, index, value) {
            params = [...params];
            index && (params[index - 1] = value);

            if (index == paramsAreaLength) {
              paramsItems.push(params);
              return;
            }
            const optionValue = paramsArea[index];
            index++;

            if (!isArray(optionValue)) {
              base(params, index, optionValue);
              return;
            }

            const [min, max] = optionValue;
            const step = (max - min) * partSize;
            for (let i = 0; i < partsLimit; i++) {
              /*
              console.log({
                level, key, value: min + (i + 1) * step,
              });
              */
              base(params, index, min + (i + 1) * step);
            }
          }
        }
      }

    })();

  });
};
