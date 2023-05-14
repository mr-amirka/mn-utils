/**
 * @overview aggregateSubscriptions
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 */

import { cancel } from "./global";

/**
 * @description
 * Aggregates an array of cancel subscription functions into one cancel subscription function
 * @example
 * ```js
 * const subscription1 = ((eventName, callback) => {
 *  window.addEventListener(eventName, callback);
 *  return () => {
 *    callback && window.removeEventListener(eventName, callback);
 *    callback = eventName = null;
 *  };
 * })('resize', () => {
 *    /...
 * });
 * const subscription2 = ((eventName, callback) => {
 *  window.addEventListener(eventName, callback);
 *  return () => {
 *    callback && window.removeEventListener(eventName, callback);
 *    callback = eventName = null;
 *  };
 * })('scroll', () => {
 *    /...
 * });
 * const subscription = aggregateSubscriptions([ subscription1, subscription2 ]);
 *
 * subscription();
 * ```
 */
declare function aggregateSubscriptions(subscriptions: cancel[]): cancel;
export = aggregateSubscriptions;
