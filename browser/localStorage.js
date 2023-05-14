module.exports = window.localStorage
  ? require('./localStorageProvider')(window)
  : require('./cookieStorage');
