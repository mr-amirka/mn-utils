/**
 * @overview forIn
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 */

import {
  fn,
} from "./global";

declare const forIn: (obj: any, iteratee: fn, ctx: any) => any;
export = forIn;
