const {
  openSync,
  mkdirSync,
  appendFile,
} = require('fs');
const {
  dirname,
} = require('path');
const isString = require('../../isString');
const isStandardObject = require('../../isStandardObject');
const formatTime = require('../../formatTime');
const {
  getRFC3339,
} = formatTime;
const {
  parse,
  stringify,
} = JSON;


function tryJsonParse(s) {
  try {
    return parse(s);
  } catch (e) {}
  return s;
}

function stringifyIteratee(k, v) {
  return v === undefined ? null : v;
}
function handleError(error) {
  error && console.error(error);
}

module.exports = (settings) => {
  settings = settings || {};
  const path = settings.path;
  if (!isString(path)) {
    throw new Error('Param "path" is invalid');
  }
  const dname = dirname(path);
  dname && mkdirSync(dname, {
    recursive: true,
  });
  const filehandle = openSync(path, 'a');

  return (ctx, next) => {
    const {
      request,
    } = ctx;
    const req = {
      time: getRFC3339(),
      method: request.method,
      url: request.url,
      header: request.header,
      // path: ctx.path,
      query: ctx.query,
    };
    return next().then((result) => {
      const {
        response,
        body,
      } = ctx;

      appendFile(filehandle, `${stringify({
        request: req,
        response: {
          time: getRFC3339(),
          status: response.status,
          message: response.message,
          header: response.header,
          body: body
            ? (
              isString(body)
                ? (
                  body.length < 1000
                    ? tryJsonParse(body)
                    : 'too_large_content'
                )
                : (isStandardObject(body) ? body : 'stream')
            )
            : body,
        },
        // errors: ctx.errors || null,
      }, stringifyIteratee, '  ')}\n`, 'utf8', handleError);
      return result;
    });
  };
};
