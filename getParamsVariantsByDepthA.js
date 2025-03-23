/**
 * @overview getParamsVariantsByDepth
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 */
// const wait = require('./wait');
const entries = require('./entries');
const sort = require('./sort');
const mapEach = require('./mapEach');
const forEach = require('./forEach');
const filter = require('./filter');
const setBase = require('./set').base;
const isPlainObject = require('./isPlainObject');


const ITEM_FIELED_ID = 0;
const ITEM_FIELED_INDEX = 1;
const ITEM_FIELED_PARAM_INDEX = 2;
const ITEM_FIELED_RESULT = 3;
const ITEM_FIELED_PARAMS = 4;
const ITEM_FIELED_STATE = 5;



module.exports = (options) => {
  options = {...options};
  return new Promise((resolve, reject) => {
    
    (async () => {
      const {
        callback,
        granularity,
        storage,
      } = options;

      const _paramsArea = (await storage.get('paramsArea')) || options.params;
      const paramsLines = entries(_paramsArea);

      const staticParams = {};
      const dynamicParams = {};

      const _staticKeys = [];
      const _dynamicKeys = [];
      const _keys = [];

      const paramsArea = {};
      const initiaParams = {};
      
      forEach(paramsLines, ([key, value]) => {
        _keys.push(key);

        if (isPlainObject(value)) {
          _dynamicKeys.push(key);

          const {
            max,
            initial,
          } = value;
          const minV = value.min || 0;
          const maxV = typeof max == 'number' ? max : 1;
          const initialV = typeof initial == 'number' ? initial : maxV;
          const option = {
            ...value,
            min: minV,
            max: maxV,
            initial: initialV,
          };

          paramsArea[key] = option;
          dynamicParams[key] = option;
          initiaParams[key] = initialV;
        } else {
          _staticKeys.push(key);

          paramsArea[key] = value;
          staticParams[key] = value;
          initiaParams[key] = value;
        }
      });

      const paramsKeys = (await storage.get('paramsKeys')) || _keys;
      const staticKeys = (await storage.get('staticKeys')) || _staticKeys;
      const dynamicKeys = (await storage.get('dynamicKeys')) || _dynamicKeys;

      const staticPaths = mapEach(staticKeys, (key) => key.split('.'));
      const dynamicPaths = mapEach(dynamicKeys, (key) => key.split('.'));

      const matrixSize = dynamicKeys.length;

      const matrix = (await storage.get('matrix')) || {};


      const initiaDynamicNativeParams = mapEach(dynamicKeys, (key) => {
        const option = dynamicParams[key];
        return getNativeParam(option.min, option.max, option.initial);
      });

      // console.log('initiaDynamicNativeParams', initiaDynamicNativeParams);

      await storage.set('paramsArea', paramsArea);
      await storage.set('paramsKeys', paramsKeys);
      await storage.set('staticKeys', staticKeys);
      await storage.set('dynamicKeys', dynamicKeys);

      await storage.set('staticParams', staticParams);
      await storage.set('dynamicParams', dynamicParams);

      await storage.set('matrix', matrix);

      await storage.set('results', (await storage.get('results')) || []);

      iteration();

      function getNativeParam(min, max, value) {
        const fraction = (max - min) / granularity;
        let i = 0;
        let prevValue = 0;
        let nextValue;

        while (i < granularity) {
          nextValue = min + (i + 1) * fraction;
          if (prevValue < value && value <= nextValue) {
            return i;
          }
          prevValue = nextValue;
          i++;
        }

        return 0;
      }

      function initStaticParams() {
        const staticParamsOutput = {};
        forEach(staticKeys, (key, index) => {
          setBase(staticParamsOutput, staticPaths[index], staticParams[key]);
        });
        return staticParamsOutput;
      }


      function genNativeVariants(initialParams, paramIndex) {
        const output = new Array(granularity);
        let i = 0;
        let variant;
        while (i < granularity) {
          variant = output[i] = [...initialParams];
          variant[paramIndex] = i;

          i++;
        }
        return output;
      }

      function getVariant(nativeVariant) {
        const params = initStaticParams();
        const excludeParams = [];
        forEach(nativeVariant, (nativeParam, paramIndex) => {
          const option = dynamicParams[dynamicKeys[paramIndex]];
          const {
            min,
            max,
            ifMaxDisableField,
          } = option;

          const value = min + (nativeParam + 1) * (max - min) / granularity;

          if (ifMaxDisableField && value == max) {
            excludeParams.push(ifMaxDisableField);
            return;
          }

          setBase(params, dynamicPaths[paramIndex], value);
        });

        forEach(excludeParams, (fieldPath) => {
          setBase(params, fieldPath.split('.'), null);
        });

        return params;
      }

      function getParams(nativeParams) {
        const params = {};

        forEach(staticKeys, (key) => {
          params[key] = staticParams[key];
        });
        forEach(nativeParams, (nativeParam, paramIndex) => {
          const key = dynamicKeys[paramIndex];
          const option = dynamicParams[key];
          const {
            min,
          } = option;

          params[key] = min + (nativeParam + 1) * (option.max - min) / granularity;
        });
        return params;
      }


      async function iteration() {
        const matrix = await storage.get('matrix');

        let index = (await storage.get('index')) || 0;
        let paramIndex = (await storage.get('paramIndex')) || 0;
        const lastDynamicNativeTopParams
          = (await storage.get('lastDynamicNativeTopParamsOfIteration'))
          || (await storage.get('lastDynamicNativeTopParams'))
          || initiaDynamicNativeParams;

        
        const _nativeVariants = genNativeVariants(lastDynamicNativeTopParams, paramIndex);
        
        const nativeVariants = filter(_nativeVariants, (variant) => {
          let i = 0;
          let nativeParam;
          let subMatrix = matrix;
          
          while (i < matrixSize) {
            nativeParam = variant[i];
            subMatrix = subMatrix[nativeParam];
            if (subMatrix === undefined) {
              return true;
            }

            i++;
          }

          return subMatrix === undefined;
        });
        
        const results = await storage.get('results');

        sort(results, (a, b) => b[ITEM_FIELED_RESULT] - a[ITEM_FIELED_RESULT]);

        const topResultItemOfPrev = results[0];
        const topResultValueOfPrev = topResultItemOfPrev ? topResultItemOfPrev[ITEM_FIELED_RESULT] : 0;

        await storage.set('lastDynamicNativeTopParamsOfIteration', lastDynamicNativeTopParams);
        await storage.set('lastDynamicNativeTopParams', lastDynamicNativeTopParams);
        await storage.set('lastTopParams', topResultItemOfPrev);

        await storage.set('paramIndex', paramIndex);
        await storage.set('index', index);

        // await storage.set('paramIndex', (matrixSize + (paramIndex - 1)) % matrixSize);
        // await storage.set('index', index - 1);

        await storage.set('results', results);

        let lastId = results.length;

        const variants = mapEach(nativeVariants, (nativeVariant) => {
          const variant = getVariant(nativeVariant);
          variant._native = nativeVariant;
          variant._paramsId = ++lastId;
          return variant;
        });

        await storage.set('variants', variants);
  

        Promise
          .resolve(storage)
          .then(callback)
          .then(async (resultsOfIteration) => {
            sort(resultsOfIteration, (a, b) => b[1] - a[1]);

            /*
            resultsOfIteration.forEach((v) => {
              console.log('v', v[0], v[1]);
            });
            */

            if (!resultsOfIteration.length) {
              resolve(results);
              return;
            }

            forEach(resultsOfIteration, ([
              params,
              result,
              topResultState,
            ]) => {
              const native = params._native;
              let i = 0;
              let nativeParam;
              let subMatrix = matrix;
              
              while (i < matrixSize) {
                nativeParam = native[i];
                subMatrix = subMatrix[nativeParam] || (subMatrix[nativeParam] = {});
                i++;
              }

              subMatrix[nativeParam] = result;

              results.push([
                params._paramsId,
                index,
                paramIndex,
                result,
                getParams(native),
                topResultState,
              ]);
            });

            const topResultItem = resultsOfIteration[0];
            const topResultParams = topResultItem[0];
            const topResultValue = topResultItem[1];
            const topResultParamsNative = topResultParams._native;
            
            await storage.set('lastDynamicNativeTopParamsOfIteration', topResultParamsNative);

            paramIndex++;
            index++;

            await storage.set('paramIndex', paramIndex % matrixSize);
            await storage.set('index', index);
            await storage.set('results', results);
            await storage.set('matrix', matrix);

            await storage.set('lastDynamicNativeTopParams', topResultParamsNative);

            if (topResultValueOfPrev && topResultValueOfPrev > topResultValue) {
              /*
              await storage.set('lastTopParams', [
                topResultValueOfPrev,
                getParams(lastDynamicNativeTopParams),
              ]);
              
              resolve(results);
              return;
              */
            } else {
              await storage.set('lastTopParams', topResultItem);
            }


            // await wait(10000);
            // process.exit();
            iteration();
          });

      }

    })();

  });
};
