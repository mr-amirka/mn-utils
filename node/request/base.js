const http = require('http');
const https = require('https');
const forEach = require('../../forEach');
const CancelablePromise = require('../../CancelablePromise');
const urlExtend = require('../../urlExtend');
const {
  provider,
} = require('./Response');


const request = module.exports = (method, url, options) => {
  return (new CancelablePromise((resolve, reject) => {
    options = urlExtend(url, options);
    const req = (options.protocol === 'https' ? https : http)
        .request(options.href, {
          method,
          headers: options.headers,
        }, resolve)
        .on('error', reject);
    body && req.write(body);
    req.end();
    return () => {
      req.abort();
    };
  })).then(provider);
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
