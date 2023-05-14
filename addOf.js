const indexOf = require('./indexOf');
const push = require('./push');
module.exports = (collection, item) => {
  indexOf(collection, item) > -1 || push(collection, item);
  return collection;
};
