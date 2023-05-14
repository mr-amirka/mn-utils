/**
 * @overview anyval
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 */

/**
 * @description
 * Converts a value to an integer
 *
 * @example
 * ```js
 * intval('12'); // => 12
 *
 * intval('12', 0, -Infinity, 10); // => 10
 *
 * intval('12dsafd', 0, -Infinity, 10); // => 0
 *
 * intval('12dsafd', 5, -Infinity, 10); // => 5
 *
 * intval('-17', 5, -Infinity, 10); // => -17
 *
 * intval('-17', 5, -10, 10); // => -10
 * ```
 */
export function intval(value: any, def?: number, minVal?: number, maxVal?: number): number;

/**
 * @description
 * Converts a value to an float
 *
 * @example
 * ```js
 * floatval('1.32'); // => 1.32
 *
 * floatval('13.67', 0, -Infinity, 9.9); // => 9.9
 * ```
 */
export declare function floatval(value: any, def?: number, minVal?: number, maxVal?: number): number;
