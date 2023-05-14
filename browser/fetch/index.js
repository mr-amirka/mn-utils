const global = require('../../_global');
const noop = require('../../noop');
const invoke = require('../../invoke');
const attachEvent = require('../../attachEvent');
const pick = require('../../pick');
const trim = require('../../trim');
const reduce = require('../../reduce');
const bind = require('../../bind');
const forIn = require('../../forIn');
const extend = require('../../extend');
const {
  intval,
} = require('../../anyval');
const CancelablePromise = require('../../CancelablePromise');
const {
  delay: cancelablePromiseDelay,
} = CancelablePromise;
const urlExtend = require('../../urlExtend');
const jsonParse = require('../../jsonParse');
const jsonStringify = require('../../jsonStringify');
const isStandardObject = require('../../isStandardObject');
const isString = require('../../isString');
const isArrayBuffer = require('../../isArrayBuffer');
const isBlob = require('../../isBlob');
const toLower = require('../../toLower');
const toUpper = require('../../toUpper');
const ab2str = require('../../ab2str');
const str2ab = require('../../str2ab');
const {
  toText: blobToText,
  toArrayBuffer: blobToArrayBuffer,
  from: blobFrom,
} = require('../blob');

const DEFAULT_RETRY_LIMIT = 3;
const DEFAULT_RETRY_TIMEOUT = 10;


const CONTENT_TYPE_KEY = 'content-type';
const GET = 'GET';
const HEAD = 'HEAD';
const FETCH_PROPS = [
  'url', 'method', 'mode', 'cache', 'credentials',
  'headers', 'redirect', 'referrerPolicy', 'body',
  'integrity', 'keepalive', 'signal',
];
const XHR1 = global.XMLHttpRequest;
const XHR2 = global.ActiveXObject;
const XHR = XHR1 || XHR2; // eslint-disable-line
const REGEXP_HEADER = /^([^:]*):\s+(.*)$/;
const {
  HEADERS_RECEIVED,
  DONE,
} = XHR;

const {
  Blob,
  location,
  fetch: originFetch,
  AbortController,
} = global;
const ArrayBuffer = global.ArrayBuffer || Array;

function Response(xhr) {
  const self = this;
  self.status = xhr.status || 0;
  self.statusText = xhr.statusText || '';
  const headers = self.headers = reduce(
      trim(invoke(xhr, 'getAllResponseHeaders') || '').split(/[\r\n]+/),
      (a, line, matchs) => {
        (matchs = REGEXP_HEADER.exec(line))
          && (a[toLower(matchs[1])] = matchs[2]);
        return a;
      },
      {},
  );
  self.url = xhr.responseURL || headers['x-request-url'] || '';
  self.text = () => base().then(onText);
  self.json = () => base().then(onJSON);
  self.arrayBuffer = () => _promise.then(onArrayBuffer);
  self.blob = () => _promise.then(blobFrom);

  const _promise = new CancelablePromise((resolve, reject) => {
    function check() {
      xhr.readyState == DONE && resolve(xhr.response || xhr.responseText);
      xhr.onreadystatechange = check;
    }
    check();
    xhr.onerror = reject;
    return bind(xhr.abort || noop, xhr);
  });
  function base() {
    return _promise.then(onBase);
  }
}
function onBase(v) {
  return isBlob(v) ? blobToText(v) : (
    isArrayBuffer(v) ? ab2str(v) : v
  );
}
function onArrayBuffer(v) {
  return isString(v) ? str2ab(v) : (
    isArrayBuffer(v) ? v : (
      isBlob(v) ? blobToArrayBuffer(v) : new ArrayBuffer(0)
    )
  );
}
function onText(v) {
  return isString(v) ? v : jsonStringify(v);
}
function onJSON(v) {
  return isString(v) ? jsonParse(v) : v;
}

function fetchPolyfillBase(options) {
  return new CancelablePromise((resolve, reject) => {
    const signal = options.signal;
    if (signal && signal.aborted) {
      return reject(new Error('Aborted'));
    }

    let _executed;
    const onProgress = options.onProgress || noop;
    const cache = options.cache;
    const method = toUpper(options.method || GET);
    const headers = options.headers || {};
    const contentType = headers[CONTENT_TYPE_KEY];
    const body = options.body;
    // eslint-disable-next-line
    const xhr = XHR1 ? (new XHR1()) : (new XHR2("Microsoft.XMLHTTP"));
    const abortXhr = bind(xhr.abort || noop, xhr);
    const cancelSignal = signal
      ? attachEvent(signal, 'abort', abortXhr)
      : noop;
    const upload = xhr.upload;
    const execute = xhr.onload = () => {
      _executed || (
        _executed = 1,
        onProgress(100),
        cancelSignal(),
        resolve(new Response(xhr))
      );
    };
    xhr.onerror = xhr.ontimeout = xhr.onabort = (error) => {
      _executed || (
        _executed = 1,
        cancelSignal(),
        reject(error)
      );
    };
    xhr.onreadystatechange = () => {
      xhr.readyState == HEADERS_RECEIVED && execute();
    };
    upload && (upload.onprogress = (e) => {
      _executed || onProgress(Math.floor(100 * e.loaded / e.total));
    });

    let url = options.href || location && location.href || '';

    if (
      (method === GET || method === HEAD)
        && (cache === 'no-store' || cache === 'no-cache')
    ) {
      url = urlExtend(url, {
        query: {
          t: (new Date()).getTime(),
        },
      }).href;
    }

    xhr.open(method, url, true);

    forIn(headers, (v, k) => {
      try {
        xhr.setRequestHeader(k, v);
      } catch (ex) {
        console.warn(ex);
      }
    });

    xhr.responseType = Blob ? 'blob' : (
      ArrayBuffer && contentType
      && contentType.indexOf('application/octet-stream')
        ? 'arraybuffer'
        : 'text'
    );
    xhr.timeout = options.timeout || 200000;
    xhr.withCredentials = options.credentials !== 'omit';

    onProgress(0);
    body ? xhr.send(body) : xhr.send();

    return () => {
      _executed || (
        _executed = 1,
        cancelSignal(),
        abortXhr()
      );
    };
  });
}

function toMapIteratee(a, v) {
  a[toLower(v[0])] = v[1];
  return a;
}
function normalizeIteratee(a, v, k) {
  a[toLower(k)] = v;
  return a;
}
function fetchProvider(request) {
  return (url, options) => {
    options = urlExtend(url, options);
    let numberOfRetries = 0;
    let headers = options.headers || {};
    headers = options.headers = headers.get && headers.entries
      ? reduce(headers.entries(), toMapIteratee, {})
      : reduce(headers, normalizeIteratee, {});


    const method = options.method = toUpper(options.method || GET);
    const retry = options.retry;
    const retryTimeout = intval(options.retryTimeout, DEFAULT_RETRY_TIMEOUT, 0);
    const retryLimit = intval(options.retryLimit, DEFAULT_RETRY_LIMIT, 0);
    const body = options.body;
    if (body) {
      const contentType = headers[CONTENT_TYPE_KEY];
      if (isStandardObject(body)) {
        options.body = jsonStringify(body);
        contentType || (headers[CONTENT_TYPE_KEY]
          = 'application/json; charset=UTF-8');
      } else {
        if (!contentType && isString(body)) {
          headers[CONTENT_TYPE_KEY] = 'text/plain;charset=UTF-8';
        }
      }
    }
    function onThen(response) {
      const {
        status,
        headers,
      } = response;
      const timeToWait = intval(headers['x-retry-after']
        || headers['retry-after'], retryTimeout, 0) * 1000;

      function throwError(message, options) {
        const error = new Error(message);
        error.response = response;
        extend(error, options);
        throw error;
      }
      response.redirectsLimit = false;
      response.loopRedirectToUrl = null;
      if ((status === 301 || status === 302) && method === 'GET') {
        numberOfRetries++;
        if (numberOfRetries > retryLimit) {
          throwError('The limit of retry redirects has been exceeded', {
            redirectsLimit: true,
          });
        }
        const location = headers.location;
        if (options.href === location) {
          throwError(`Loop redirect to ${location}`, {
            loopRedirectToUrl: location,
          });
        }
        options = urlExtend(options, location);
        return cancelablePromiseDelay(timeToWait).then(base);
      }
      if (retry && (status === 503 || status === 429 || status === 418)) {
        numberOfRetries++;
        if (numberOfRetries > retryLimit) {
          throwError(`The retry limit has been exceeded`, {
            retryLimit: true,
          });
        }
        return cancelablePromiseDelay(timeToWait).then(base);
      }
      return response;
    }
    function base() {
      return request(options).then(onThen);
    }
    return base();
  };
}

const fetchPolyfill = fetchProvider(fetchPolyfillBase);
const fetch = module.exports = originFetch && AbortController
  ? fetchProvider((options) => {
    return new CancelablePromise((resolve) => {
      let originSignal = options.signal;
      let controller = new AbortController();
      let abortFn = bind(controller.abort, controller);
      options.signal = controller.signal;
      let _cancel = originSignal
        && attachEvent(originSignal, 'abort', cancel) || noop;
      let onProgress = options.onProgress || noop;

      function cancel() {
        if (!controller) return;
        _cancel();
        abortFn();
        controller = onProgress = originSignal = abortFn = _cancel
          = options = 0;
      }

      onProgress(0);
      resolve(
          originFetch(options.href, pick(options, FETCH_PROPS)).then((v) => {
            onProgress && onProgress(100);
            return v;
          }),
      );
      return cancel;
    });
  })
  : fetchPolyfill;

fetch.wrapper = fetchProvider;
fetch.fetch = fetch;
fetch.request = fetchPolyfill;
fetch.base = fetchPolyfillBase;
fetch.Response = Response;
