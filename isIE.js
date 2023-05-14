/**
 * @overview isIE
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 *
 */

const regexp = /MSIE|Trident/;
module.exports = (window, n) => {
  return (n = window.navigator) && regexp.test(n.userAgent);
};
