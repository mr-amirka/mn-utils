const CancelablePromise = require('../CancelablePromise');
const dynamicModule = require('./dynamicModule');
const dynamic = require('./dynamic');

module.exports = dynamicModule((options) => {
  return dynamic('https://api-maps.yandex.ru/2.1/', {
    query: {
      load: 'package.full',
      lang: 'ru-RU',
    },
  }).then(() => {
    return new CancelablePromise((resolve) => {
      const ymaps = window.ymaps;
      ymaps.ready(() => {
        resolve(ymaps);
      });
    });
  });
});
