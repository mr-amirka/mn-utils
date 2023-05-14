/**
 * @overview attachEvent
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 */

import {
  cancel,
} from "./global";

/**
 * @description
 * Sets up a function that will be called whenever the specified event is delivered to the target.
 *
 * @example
 * ```js
 * const cancel = attachEvent(element, 'click', (e) => {
 *   //...
 * }, false);
 * ```
 */
declare function attachEvent(node: EventTarget, eventName: string, cb: (e?: Event) => any, options?: any): cancel;
export = attachEvent;
