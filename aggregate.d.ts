/**
 * @overview aggregate
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 */

import {eachApply, fn} from "./global";

/**
 * @description
 * Aggregates an array of functions into one function
 * @example
 * ```js
 * const fn1 = v => console.log(v);
 * const fn2 = v => console.log(v + v);
 * const aggregatedFn = aggregate([ fn1, fn2 ]);
 *
 * aggregatedFn(2) // => 2, 4
 * ```
 */
declare function aggregate(funcs: fn[], aggregator?: eachApply): fn;
export = aggregate;
