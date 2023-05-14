/**
 * @overview without
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 */

/**
 * @example
 * const src = { name: 'Vasya', age: 10, height: 170, weight: 90};
 * without(src, [ 'height', 'weight' ]) => // { name: 'Vasya', age: 10 }
 */

declare function without(
  src: {[name: string]: any},
  without: string[],
  dst: null | undefined | {[name: string]: any},
): {[name: string]: any};
export = without;
