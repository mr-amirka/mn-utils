const isString = require('./isString');

// eslint-disable-next-line
const URL_VALIDATION_REGEX = /^(https?:\/\/)?(([A-Za-zА-Яа-я0-9]|[A-Za-zА-Яа-я0-9][A-Za-zА-Яа-я0-9\-]*[A-Za-zА-Яа-я0-9])\.)+[A-Za-zА-Яа-я][A-Za-zА-Яа-я\-]*[A-Za-zА-Яа-я](\/([\w#!:.?+=&%@!\-\/])*)?/;

/**
 * Check if an URL is valid.
 *
 * @param {String} url the URL to validate.
 * @return {boolean} true if the passed URL is valid, false otherwise
 */
module.exports = (url) => isString(url) && URL_VALIDATION_REGEX.test(url);
