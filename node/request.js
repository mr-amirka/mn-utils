const http = require('http');
const https = require('https');
const isObject = require('../isObject');
const extend = require('../extend');
const CancelablePromise = require('../CancelablePromise');
const urlExtend = require('../urlExtend');

function request(url, options) {
  return new CancelablePromise((resolve, reject) => {
    const __options = urlExtend(url, options = options || {});
    const headers = extend({}, options.headers);
    let body = options.body;

    body && isObject(body) && (
      body = JSON.stringify(body),
      headers['Content-Type'] = 'application/json'
    );
    body && (body = Buffer.from(body, 'utf-8'));
    body && (headers['Content-Length'] = body.length);

    const req = (__options.protocol === 'https' ? https : http).request(
        __options.href,
        {
          method: (options.method || 'GET').toUpperCase(),
          headers,
        },
        (res) => {
          const {statusCode} = res;
          let error;
          if (statusCode !== 200) {
            error = new Error('Request Failed.\n'
            + `Status Code: ${statusCode}`);
          }
          if (error) {
            res.resume();
            reject(error);
            return;
          }

          res.setEncoding('utf8');
          const rawData = [];
          res.on('data', (chunk) => {
            rawData.push(chunk);
          });
          res.on('end', () => {
            const body = rawData.join('');
            try {
              resolve(JSON.parse(body));
            } catch (e) {
              resolve(body);
            }
          });
        })
        .on('error', reject);
    body && req.write(body);
    req.end();
    return () => {
      req.abort();
    };
  });
}

function methodProvider(method) {
  return (url, options) => {
    const __options = extend({}, options);
    __options.method = method;
    return request(url, __options);
  };
}

module.exports = {
  request,
  get: methodProvider('get'),
  post: methodProvider('post'),
  options: methodProvider('options'),
  del: methodProvider('delete'),
  put: methodProvider('put'),
};
