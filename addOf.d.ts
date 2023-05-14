/**
 * @overview addOf
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 */

/**
 * @description
 * Adds an element to the array-like object if the array-like object does not already contain it.
 * @example
 * ```js
 * const source = [];
 * addOf(source, 10); //=> [ 10 ]
 * addOf(source, 5); //=> [ 10, 5 ]
 * addOf(source, 10); //=> [ 10, 5 ]
 * addOf(source, 4); //=> [ 10, 5, 4 ]
 * addOf(source, 5); //=> [ 10, 5, 4 ]
 * ```
 */
declare function addOf(collection: any[], item: any): any[];
export = addOf;
