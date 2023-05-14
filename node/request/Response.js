const {
  deflate,
  gunzip,
} = require('zlib');
const CancelablePromise = require('../../CancelablePromise');
const UNZIP_CONTENT = ['deflate', 'gzip'];

/*
TODO:
arrayBuffer() (en-US)
blob() (en-US)
json() (en-US)
text() (en-US)
formData() (en-US)
*/
function Response(origin) {
  this._origin = origin;
  this.status = origin.statusCode;
  this.headers = origin.headers;
}
function toJson(v) {
  return JSON.parse(v);
}
Response.provider = (origin) => new Response(origin);
Response.prototype = {
  text() {
    const self = this;
    const _promise = self._promise;
    if (_promise) {
      return _promise;
    }
    const response = self._origin;
    const contentEncoding = response.headers['content-encoding'];
    const skipUnzip = UNZIP_CONTENT.indexOf(contentEncoding) === -1;
    const promise = new CancelablePromise((resolve, reject) => {
      const chunks = [];
      response.setEncoding(skipUnzip ? 'utf8' : 'binary');
      response
          .on('data', skipUnzip ? ((chunk) => {
            chunks.push(chunk);
          }) : ((chunk) => {
            chunks.push(Buffer.from(chunk));
          }))
          .on('end', () => {
            resolve(skipUnzip ? chunks.join('') : Buffer.concat(chunks));
          })
          .on('error', reject);
      return () => {
        response.close
          ? response.close()
          : response.destroy && response.destroy();
      };
    });
    return self._promise = (skipUnzip ? promise : promise.then((body) => {
      return new CancelablePromise((resolve, reject) => {
        (
          contentEncoding === 'deflate'
            ? deflate
            : gunzip
        )(body, (error, body) => {
          if (error) {
            return reject(error);
          }
          try {
            resolve(body.toString('utf8'));
          } catch (e) {
            return reject(e);
          }
        });
      });
    }))
        .then((text) => self._text = text);
  },
  json() {
    return this.text().then(toJson);
  },
};

module.exports = Response;
