const isArray = require('mn-utils/isArray');

module.exports = (urls) => {
  if (!isArray(urls)) return () => urls;
  const length = urls.length;
  let index = 0;
  return () => urls[index++ % length];
};
