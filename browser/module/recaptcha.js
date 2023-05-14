const _global = require('../../_global');
const CancelablePromise = require('../../CancelablePromise');
const getTime = require('../../time');
const dynamicModule = require('../dynamicModule');
const dynamic = require('../dynamic');


module.exports = dynamicModule((options) => {
  return new CancelablePromise((resolve) => {
    const CALLBACK_NAME = 'RECAPTCHA_' + getTime();
    _global[CALLBACK_NAME] = () => {
      resolve(_global.grecaptcha);
    };
    dynamic('https://www.google.com/recaptcha/api.js', {
      query: {
        onload: CALLBACK_NAME,
      },
    });
  });
});
