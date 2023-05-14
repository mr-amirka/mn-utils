const time = require('../time');
const delay = require('../delay');
const merge = require('../merge');
const CancelablePromise = require('../CancelablePromise');
const script = require('./script');
const globalName = require('./globalNameProvider')(window, 'JSONP_');

const ERROR_TIMEOUT = 500;

module.exports = (url, options) => {
  return new CancelablePromise((resolve, reject) => {
    let _stop;
    return script(url, merge([
      options,
      {
        query: merge([
          options && options.query,
          {
            // hostname: location.hostname,
            callback: globalName(function(response) {
              _stop = 1;
              resolve(response);
            }, '_' + time()),
          },
        ]),
      },
    ])).then(() => {
      _stop || delay(() => {
        _stop || reject('script error');
      }, ERROR_TIMEOUT);
    }, reject).cancel;
  });
};
