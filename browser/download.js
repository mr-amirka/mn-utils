const CancelablePromise = require('../CancelablePromise');
const extend = require('../extend');
const getDataLink = require('./getDataLink');
const ready = require('./ready');
const doc = document;


function base(url, filename) {
  return (new CancelablePromise((resolve) => {
    ready(() => {
      const link = extend(doc.createElement('a'), {
        href: url,
        download: filename || ('' + 1 * new Date()),
        target: '_blank',
        style: 'display:none;',
      });
      /* fix for Firefox gecko */
      const body = doc.body;
      body.appendChild(link);
      link.click();
      body.removeChild(link);
      resolve(true);
    });
  }));
}
function download(content, type, filename) {
  return base(getDataLink(content, type), filename);
}
download.base = base;

module.exports = download;
