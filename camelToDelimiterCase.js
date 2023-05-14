const toLower = require('./toLower');
const regexp = /([A-Z])/g;


module.exports = (v, delimeter) => {
  return v.replace(regexp, (all, v) => (delimeter + toLower(v)));
};
