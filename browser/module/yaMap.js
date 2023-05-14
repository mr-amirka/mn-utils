const CancelablePromise = require('../../CancelablePromise');
const dynamicModule = require('../dynamicModule');
const dynamic = require('../dynamic');
const merge = require('../../merge');

module.exports = dynamicModule((options) => {
  return dynamic('https://api-maps.yandex.ru/2.1/', {
    query: merge([
      {
        load: 'package.full',
        lang: 'ru-RU',
      },
      options,
    ]),
  }).then(() => {
    return new CancelablePromise((resolve) => {
      const ymaps = window.ymaps;
      ymaps.ready(() => {
        resolve(ymaps);
      });
    });
  });
});
