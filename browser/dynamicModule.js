/**
 * @overview dynamicModule
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 *
 */

/*
const yaMapModule = dynamicModule((options) => {
  return dynamic('https://api-maps.yandex.ru/2.1/', {
    query: {
      load: 'package.full',
      lang: 'ru-RU',
    },
  }).then(() => {
    console.log('yaMapModule is loaded!');
    return new CancelablePromise((resolve) => {
      const ymaps = window.ymaps;
      ymaps.ready(() => resolve(ymaps));
    });
  });
});

yaMapModule().then((ymaps) => {
  console.log('yaMapModule is getted!');
});
*/

const CancelablePromise = require('../CancelablePromise');
const decorate = require('../decorate');

module.exports = decorate((init) => {
  let promise;
  return (options) => promise
    || (promise = CancelablePromise.resolve(init(options)))
        .catch((error) => {
          console.error(error),
          promise = null;
        });
});
