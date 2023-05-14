const getViewportSize = require('../getViewportSize');


module.exports = require('../../attachEventObservable')(window, 'resize')
    .map(getViewportSize, 0, getViewportSize());
