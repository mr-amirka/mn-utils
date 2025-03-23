const jsonParse = require('../../../../json/parse');
const readFile = require('../read');

module.exports = (path) => {
  return readFile(path + '.json', 'utf8')
    .then(jsonParse);
};
