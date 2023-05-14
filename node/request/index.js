const http = require('http');
const https = require('https');
const logger = require('debug')('mn-utils:node:request');
const {
  intval,
} = require('../../anyval');
const isBuffer = require('../../isBuffer');
const isFormData = require('../../isFormData');
const isStandardObject = require('../../isStandardObject');
const reduce = require('../../reduce');
const toLower = require('../../toLower');
const toUpper = require('../../toUpper');
const forEach = require('../../forEach');
const CancelablePromise = require('../../CancelablePromise');
const {
  delay: cancelablePromiseDelay,
} = CancelablePromise;
const urlExtend = require('../../urlExtend');
const {
  provider,
} = require('./Response');

const DEFAULT_RETRY_LIMIT = 3;
const DEFAULT_RETRY_TIMEOUT = 10;


let _requestId = 0;
function normalizeIteratee(a, v, k) {
  a[toLower(k)] = v;
  return a;
}
const request = module.exports = (method, url, options) => {
  const id = ++_requestId;
  options = urlExtend(url, options);
  const headers = reduce(options.headers, normalizeIteratee, {});
  const retry = options.retry;
  const retryTimeout = intval(options.retryTimeout, DEFAULT_RETRY_TIMEOUT, 0);
  const retryLimit = intval(options.retryLimit, DEFAULT_RETRY_LIMIT, 0);
  const followAllRedirects = options.followAllRedirects;
  let body = options.body;
  let numberOfRetries = 0;

  method = toUpper(method);
  url = options.href;

  isStandardObject(body) && (
    body = JSON.stringify(body),
    headers['content-type'] = 'application/json'
  );
  isFormData(body) && (body = body.getBuffer());
  body && !isBuffer(body) && (body = Buffer.from(body, 'utf-8'));
  body && (headers['content-length'] = body.length);

  const opts = {
    method,
    headers,
    timeout: 20000,
  };
  const exec = (options.protocol === 'https' ? https : http).request;

  logger(`Request ${id}. ${method} ${url}`);

  return base().then(provider);

  function base() {
    return (new CancelablePromise((resolve, reject) => {
      function cancel() {
        req && (
          request.destroy(),
          req = 0
        );
      }
      const req = exec(url, opts, resolve)
          .on('error', (err) => {
            cancel();
            reject(err);
          });
      body && req.write(body);
      req.end();
      return cancel;
    })).then(onResponse);
  }
  function onResponse(response) {
    const {
      statusCode,
      headers,
    } = response;
    const timeToWait = intval(headers['x-retry-after']
      || headers['retry-after'], retryTimeout, 0) * 1000;

    function throwError(message) {
      logger(message);
      const error = new Error(message);
      error.response = provider(response);
      throw error;
    }

    if (
      followAllRedirects
        && (statusCode === 301 || statusCode === 302)
        && method === 'GET'
    ) {
      numberOfRetries++;
      if (numberOfRetries > retryLimit) {
        throwError(`Request ${id
        }. The limit of retry redirects has been exceeded`);
      }
      const location = headers.location;
      if (url === location) {
        throwError(`Request ${id}. Loop redirect to ${location}`);
      }
      url = location;
      return cancelablePromiseDelay(timeToWait).then(onRedirect);
    }

    if (retry && (statusCode === 503 || statusCode === 429
      || statusCode === 418)) {
      numberOfRetries++;
      if (numberOfRetries > retryLimit) {
        throwError(`Request ${id}. The retry limit has been exceeded`);
      }
      // eslint-disable-next-line
      logger(`Request ${id}. You have reached the rate limit for the API. Please retry in ${timeToWait} seconds`);

      return cancelablePromiseDelay(timeToWait).then(onRetry);
    }
    return response;
  }
  function onRedirect() {
    logger(`Request ${id} is redirected to ${url}. Number of retries: ${
      numberOfRetries}`);
    return base();
  }
  function onRetry() {
    logger(`Request ${id}. Restarting request call after suggested time`);
    return base();
  }
};


forEach([
  'get',
  'post',
  'put',
  'head',
  'delete',
  'options',
], (method) => {
  request[method] = (url, options) => request(method, url, options);
});
