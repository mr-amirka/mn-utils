const extend = require('../../extend');
const each = require('./each');


module.exports = (folderPath, options) => {
  const output = [];
  return each(folderPath, extend(extend({}, options), {
    iteratee: output.push.bind(output),
  })).then(() => output);
};
