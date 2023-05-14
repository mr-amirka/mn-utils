const CancelablePromise = require('../CancelablePromise');


module.exports = (url) => {
  return new CancelablePromise((resolve) => {
    const image = new Image();
    image.onload = () => {
      resolve(image);
    };
    image.src = url;
  });
};
