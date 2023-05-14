/**
 * @overview cancelableThen
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 */

import {cancel} from "./global";

/**
 * @example
 * ```js
 * const promise = new Promise((resolve) => {
 *   setTimeout(resolve, 1000, 'test');
 * });
 * const cancel = cancelableThen(promise, (v) => {
 *   console.log(v);
 * });
 * cancel();
 * ```
 */

declare function cancelableThen(promise: any, onThen: (subject: any) => any): cancel;
export = cancelableThen;
