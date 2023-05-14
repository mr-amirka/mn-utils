const escapeHTML = require('./escapeHTML');

module.exports = (v) => {
  return escapeHTML(v).replace(/\n/g, '<br/>');
};
