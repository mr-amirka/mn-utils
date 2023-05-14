const getImageByUrl = require('./getImageByUrl');


module.exports = (url, options) => {
  return getImageByUrl(url).then((img) => {
    options = options || {};
    const canvas = document.createElement('canvas');
    canvas.width = options.width || img.naturalWidth || img.width || 0;
    canvas.height = options.height || img.naturalHeight || img.height || 0;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, options.left || 0, options.top || 0);
    return canvas.toDataURL(options.type || 'image/png');
  });
};
