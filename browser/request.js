const {
  base: __requestBase,
  request: __request,
} = require('./fetch');

function onResponse(response) {
  const {
    status,
  } = response;
  return response.json().catch((e) => {
    throw status > 199 && status < 400
      ? e
      : (
        e = new Error(status ? ('HTTP status: ' + status) : 'No connection'),
        e.code = status,
        e
      );
  });
}
function request(url, options) {
  return __request(url, options).then(onResponse);
}
request.base = (options) => {
  return __requestBase(options).then(onResponse);
};
module.exports = request;
