/**
 * @overview request
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 */
const once = require('../once');
const invoke = require('../invoke');
const extend = require('../extend');
const merge = require('../merge');
const CancelablePromise = require('../CancelablePromise');
const urlExtend = require('../urlExtend');
const jsonParse = require('../jsonParse');
const isString = require('../isString');

const defaultOptions = {
  method: 'GET',
  timeout: 200000,
  responseType: 'json',
  headers: {
    Accept: 'application/json, text/javascript, */*',
  },
};

function request(url, options) {
  const __options = merge([defaultOptions, options], {});
  __options.headers = merge([defaultOptions.headers, __options.headers]);
  return base(extend(__options, urlExtend(url, __options)));
}
function base(_options) {
  const body = _options.body;
  const method = _options.method;
  const timeout = _options.timeout;
  const responseType = (_options.responseType || '').toLowerCase();
  const _url = _options.href;
  const headers = _options.headers;

  return new CancelablePromise((resolve, reject) => {
    let stop = 0; // eslint-disable-line
    const XHR1 = window.XMLHttpRequest, XHR2 = window.ActiveXObject; // eslint-disable-line
    const XHR = XHR1 || XHR2; // eslint-disable-line
    const xhr = XHR1 ? (new XHR1()) : (new XHR2("Microsoft.XMLHTTP")); // eslint-disable-line
    let k;
    let hasError;
    const execute = xhr.onload = once(() => {
      if (hasError) return;
      const status = xhr.status || 0;
      status > 199 && status < 400
        ? resolve(xhr.response)
        : __reject(new Error(
          status
            ? ('HTTP status: ' + status)
            : 'No connection',
        ));
    });
    const __reject = xhr.onerror = once((err) => {
      hasError = 1;
      stop || reject(err);
    });

    xhr.onreadystatechange = () => {
      xhr.readyState == XHR.DONE && execute();
    };
    xhr.open(method, _url, true);

    for (k in headers) { //eslint-disable-line
      try {
        xhr.setRequestHeader(k, headers[k]);
      } catch (ex) {
        console.warn(ex);
      }
    }

    if (timeout) xhr.timeout = timeout;
    if (responseType) xhr.responseType = responseType;

    xhr.send(body);

    return () => {
      if (stop) return false;
      stop = 1;
      invoke(xhr, 'abort');
      return true;
    };
  }).then(
      (response) => isString(response) && responseType === 'json'
        ? jsonParse(response)
        : response,
  );
};

request.base = base;
module.exports = request;
