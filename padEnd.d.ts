/**
 * @overview padEnd
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 */

 /**
  * @example
  * ```js
  *   padEnd('2', 4, '0'); // => '2000'
  * ```
  */
declare function padEnd(value: string, length: number, space?: string): string;
export = padEnd;
