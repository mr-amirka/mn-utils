const blobFrom = require('./blob/from');


module.exports = (content, type) => {
  return URL.createObjectURL(blobFrom(content, type));
};
