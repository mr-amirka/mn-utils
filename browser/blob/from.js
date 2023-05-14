const isBlob = require('../../isBlob');
const isArrayBuffer = require('../../isArrayBuffer');
const isDefined = require('../../isDefined');
const isObject = require('../../isObject');
const jsonStringify = require('../../jsonStringify');

const TYPE_BINARY = 'application/octet-binary';

function normalize(content, buffer) {
  return isDefined(content) ? (
    isObject(content) ? (
      isArrayBuffer(content)
        ? [content, TYPE_BINARY]
        : (
          isArrayBuffer(buffer = content.buffer)
            ? [buffer, TYPE_BINARY]
            : [jsonStringify(content), 'application/json']
        )
    ) : ['' + content, 'text/plain']
  ) : ['', TYPE_BINARY];
}


module.exports = (content, type) => {
  if (isBlob(content)) return content;
  const args = normalize(content);
  return new Blob([args[0]], {type: type || args[1]});
};
