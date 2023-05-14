/**
 * @overview bind
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 */

/**
 * @example
 * ```js
 * const logInfo = bind(console.log, console, ['info:']);
 * logInfo('Ooops!'); // => 'info:' 'Ooops!'
 * ```
 */
declare function bind<A>(fn: (...args: any[]) => A, ctx?: any, args?: any[]): ((...args: any[]) => A);
export = bind;
