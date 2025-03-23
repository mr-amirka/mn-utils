const jsonStringify = require('../../../../json/stringify');
const writeFile = require('../write');

module.exports = (path, data, minify) => {
  return writeFile(
      path + '.json',
      jsonStringify(data, null, minify ? '' : '  '),
  );
};
