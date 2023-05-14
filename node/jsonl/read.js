const {
  createReadStream,
} = require('fs');
const TransformFrom = require('./TransformFrom');


module.exports = (path, options) => {
  return createReadStream(path, options).pipe(new TransformFrom());
};
