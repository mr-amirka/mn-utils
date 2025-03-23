/**
 * @overview getParamsVariantsByDepth
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 */
// const wait = require('./wait');
const entries = require('./entries');
const sort = require('./sort');
const mapEach = require('./mapEach');
const forEach = require('./forEach');
const reduceEach = require('./reduceEach');
const isEqual = require('./isEqual');
const filter = require('./filter');
const setBase = require('./set').base;
const isPlainObject = require('./isPlainObject');


const ITEM_FIELED_ID = 0;
const ITEM_FIELED_INDEX = 1;
const ITEM_FIELED_PARAM_INDEX = 2;
const ITEM_FIELED_RESULT = 3;
const ITEM_FIELED_PARAMS = 4;
const ITEM_FIELED_STATE = 5;

const PRECISION = 0.0000001;


function optionNormalize(value) {
  const {
    max,
  } = value;
  const initial = value.initial || value.value;
  const minV = value.min || 0;
  const maxV = typeof max == 'number' ? max : 1;
  const initialV = typeof initial == 'number' ? initial : maxV;

  return {
    ...value,
    min: minV,
    max: maxV,
    initial: initialV,
  };
}


module.exports = (options) => {
  options = {...options};
  return new Promise((resolve, reject) => {
    
    (async () => {
      const {
        callback,
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
      const additionalKeys = [];
      
      forEach(paramsLines, ([key, value]) => {
        _keys.push(key);

        if (isPlainObject(value)) {
          _dynamicKeys.push(key);
          const option = optionNormalize(value);
          const {
            withField,
          } = option;
          if (withField && !additionalKeys.includes(withField)) {
            additionalKeys.push(withField);
          }
          
          paramsArea[key] = option;
          dynamicParams[key] = option;
          initiaParams[key] = option.initial;
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

      const staticPaths = staticKeys.map((key) => key.split('.'));
      const dynamicPaths = dynamicKeys.map((key) => key.split('.'));

      const matrixSize = dynamicKeys.length;

      const matrix = (await storage.get('matrix')) || {};


      const initiaDynamicNativeParams = dynamicKeys.map(getNativeParam);

      // console.log('initiaDynamicNativeParams', initiaDynamicNativeParams);

      await storage.set('paramsArea', paramsArea);
      await storage.set('paramsKeys', paramsKeys);
      await storage.set('staticKeys', staticKeys);
      await storage.set('dynamicKeys', dynamicKeys);

      await storage.set('staticParams', staticParams);
      await storage.set('dynamicParams', dynamicParams);

      await storage.set('matrix', matrix);

      // await storage.set('results', (await storage.get('results')) || []);

      iteration().catch(reject);

      function getNativeParam(key) {
        const option = dynamicParams[key];

        const {
          min,
          max,
          initial: value,
          variants,
        } = option;
        let i = 0, granularity = variants && variants.length || 0;

        if (granularity) {
          for (; i < granularity; i++) {
            /*
            console.log({
              key,
              i,
              value,
              variants,
              v: Math.abs(variants[i] - value),
            });
            */
            if (Math.abs(variants[i] - value) < PRECISION) {
              return i;
            }
          }
          return 0;
        }

        const fraction = option.step || 0.05;

        for (granularity = Math.floor((max - min) / fraction); i < granularity; i++) {

          /*
          console.log({
            key,
            i,
            value,
            min,
            fraction,
            v: (min + i * fraction),
            granularity,
          });
          */

          if (Math.abs((min + i * fraction) - value) < PRECISION) {
            return i;
          }
        }

        return granularity;
      }

      function initStaticParams() {
        const staticParamsOutput = {};
        forEach(staticKeys, (key, index) => {
          setBase(staticParamsOutput, staticPaths[index], staticParams[key]);
        });
        return staticParamsOutput;
      }


      function genNativeVariants(initialParams, paramIndex) {
        const option = dynamicParams[dynamicKeys[paramIndex]];
        const variantsOfOrigin = option.variants;
        const granularity = variantsOfOrigin && variantsOfOrigin.length
          || (Math.floor((option.max - option.min) / option.step) + 1);


        // console.log('genNativeVariants:granularity', granularity, option);
        
        let variants = new Array(granularity);
        let i = 0;
        let variant;
        while (i < granularity) {
          variant = variants[i] = [...initialParams];
          variant[paramIndex] = i;

          i++;
        }

        const {
          withField,
        } = option;
        const nextIndex = withField ? dynamicKeys.indexOf(withField) : -1;
        
        return nextIndex > -1 ? reduce(variants, (output, variantParams) => {
          output.push.apply(output, genNativeVariants(variantParams, nextIndex));
          return output;
        }, []) : variants;
      }

      function getVariant(nativeVariant) {
        const params = initStaticParams();
        const excludeParams = [];
        forEach(nativeVariant, (nativeParam, paramIndex) => {
          const option = dynamicParams[dynamicKeys[paramIndex]];
          const {
            ifMinDisableField,
            variants: variantsOfOrigin,
          } = option;
          
          if (ifMinDisableField && !nativeParam) {
            excludeParams.push(ifMinDisableField);
            return;
          }

  
          setBase(
            params,
            dynamicPaths[paramIndex],
            variantsOfOrigin && variantsOfOrigin.length
              ? variantsOfOrigin[nativeParam]
              : (option.min + nativeParam * option.step),
          );
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
            variants,
          } = option;

          params[key] = variants
            ? variants[nativeParam]
            : (option.min + nativeParam * option.step);
        });
        return params;
      }


      async function iteration() {
        const matrix = await storage.get('matrix');

        let lastId = (await storage.get('lastId')) || 0;
        let index = (await storage.get('index')) || 0;
        let paramIndex = (await storage.get('paramIndex')) || 0;
        const lastDynamicNativeTopParams
          = (await storage.get('lastDynamicNativeTopParamsOfIteration'))
          || (await storage.get('lastDynamicNativeTopParams'))
          || initiaDynamicNativeParams;

        
        let lastTopParams = await storage.get('lastTopParams');
        if (!lastTopParams) {
          const results = (await storage.get('results')) || [];
          results.sort((a, b) => b[ITEM_FIELED_RESULT] - a[ITEM_FIELED_RESULT]);
          lastTopParams = results[0];
          if (lastTopParams) {
            await storage.set('lastTopParams', lastTopParams);
            await storage.set('results', []);
          }
        }

        const lastTopResultValue = lastTopParams ? lastTopParams[ITEM_FIELED_RESULT] : 0;

        await storage.set('lastDynamicNativeTopParamsOfIteration', lastDynamicNativeTopParams);
        await storage.set('lastDynamicNativeTopParams', lastDynamicNativeTopParams);
        
        await storage.set('paramIndex', paramIndex);
        await storage.set('index', index);
        await storage.set('lastId', lastId);


        function setToMatrix(native, result) {
          let i = 0;
          let nativeParam;
          let subMatrix = matrix;
          
          while (i < matrixSize) {
            nativeParam = native[i];
            subMatrix = subMatrix[nativeParam] || (subMatrix[nativeParam] = {});
            i++;
          }

          subMatrix[nativeParam] = result;
        }

        let _nativeVariants, nativeVariants, variants;
        while (true) {
          _nativeVariants = genNativeVariants(lastDynamicNativeTopParams, paramIndex);
        
          nativeVariants = filter(_nativeVariants, (variant) => {
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

          /*
          console.log({
            _nativeVariants,
            nativeVariants,
          });
          */

          if (!nativeVariants.length) {
            break;
          }

          variants = mapEach(reduceEach(nativeVariants, (variantBoxes, nativeVariant) => {
            const variant = getVariant(nativeVariant);

            if (variantBoxes.find((v) => isEqual(v.variant, variant, 10))) {
              setToMatrix(nativeVariant, 0);
            } else {
              variantBoxes.push({
                variant,
                nativeVariant,
                paramsId: ++lastId,
              });
            }

            return variantBoxes;
          }, []), (v) => {
            return {
              ...v.variant,
              _native: v.nativeVariant,
              _paramsId: v.paramsId,
            };
          });

          if (variants.length) {
            break;
          }

          paramIndex++;
          index++;

          let dynamicKey = dynamicKeys[paramIndex];
          while (additionalKeys.includes(dynamicKey)) {
            paramIndex++;
            index++;
            dynamicKey = dynamicKeys[paramIndex];
          }
          

          await storage.set('paramIndex', paramIndex);
          await storage.set('index', index);
        }

        // console.log('variants', variants);

        await storage.set('paramIndex', paramIndex % matrixSize);
        await storage.set('index', index);
        await storage.set('lastId', lastId);
        await storage.set('matrix', matrix);
        await storage.set('variants', variants);

        /*
        console.log({
          lastDynamicNativeTopParams,
          nativeVariants,
          _nativeVariants,
          variants,
        });
        */

        Promise
          .resolve(storage)
          .then(callback)
          .then(async (resultsOfIteration) => {
            resultsOfIteration.sort((a, b) => b[1] - a[1]);

            /*
            resultsOfIteration.forEach((v) => {
              console.log('v', v[0], v[1]);
            });
            */

            if (!resultsOfIteration.length) {
              resolve();
              return;
            }

            forEach(resultsOfIteration, ([
              params,
              result,
            ]) => {
              setToMatrix(params._native, result);
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
            // await storage.set('results', results);
            await storage.set('matrix', matrix);

            await storage.set('lastDynamicNativeTopParams', topResultParamsNative);

            if (lastTopResultValue && lastTopResultValue > topResultValue) {
             
            } else {
              await storage.set('lastTopParams', (([
                params,
                result,
                topResultState,
              ]) => {
                const _paramsId = params._paramsId;
         
                return [
                  _paramsId,
                  index,
                  paramIndex,
                  result,
                  {
                    _paramsId,
                    ...getParams(params._native),
                  },
                  topResultState,
                ];
              })(topResultItem));
            }


            // await wait(10000);
            // process.exit();
            iteration().catch(reject);
          }).catch(reject);;

      }

    })().catch(reject);

  });
};
