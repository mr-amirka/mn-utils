/**
 * @overview dynamic
 * @author Amir Absalyamov <mr.amirka@ya.ru>

@example
dynamic('https://api-maps.yandex.ru/2.1/?load=package.full&lang=ru-RU').then(() => {
  window.ymaps.ready(() => {

  })
});

dynamic('https://api-maps.yandex.ru/2.1/', {
  load: 'package.full',
  lang: 'ru-RU'
}).then(() => {
  window.ymaps.ready(() => {

  })
});
*/


const decorate = require('../decorate');
const urlExtend = require('../urlExtend');
const script = require('./script').base;
const cache = {};

module.exports = decorate((url, options) => {
  const href = urlExtend(url, options).href;
  return cache[href] || (cache[href] = script(href).catch((err) => {
    delete cache[href];
    throw err;
  }));
});
