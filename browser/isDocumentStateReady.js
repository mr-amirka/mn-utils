/**
 * @overview isDocumentStateReady
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 *
 */

const isIE = require('../isIE');
module.exports = (window) => {
  const s = window.document.readyState;
  return isIE(window) ? (s == 'complete') : /complete|interactive/.test(s);
};
