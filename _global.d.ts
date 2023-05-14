/**
 * @overview _global
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 */

 /**
  * @desctiption
  * Global oblect:
  *   - 'window' for browser
  *   - 'self' for webworker
  *   - 'global' for node.js
  *   - 'this' or 'null' if other not support
  */
declare const _global: any;
export = _global;
