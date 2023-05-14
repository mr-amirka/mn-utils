const crypto = require('crypto');
module.exports = (text, type) => {
  const hash = crypto.createHash(type || 'sha256');
  hash.update(text);
  return hash.digest('hex');
};
