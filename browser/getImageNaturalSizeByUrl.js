const getImageByUrl = require('./getImageByUrl');


module.exports = (url) => {
  return getImageByUrl(url).then((img) => {
    return [
      img.naturalWidth || img.width || 0,
      img.naturalHeight || img.height || 0,
    ];
  });
};
