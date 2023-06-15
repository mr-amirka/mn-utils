const CancelablePromise = require('../CancelablePromise');


module.exports = (url) => {
  return new CancelablePromise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      resolve(image);
    };
    image.onerror = reject;
    image.src = url;
  });
};
