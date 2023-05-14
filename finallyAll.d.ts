/**
 * @overview finallyAll
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 */

import { fn } from "./global";

declare const finallyAll: (fn: (inc: () => void, dec: () => void) => any, callback: fn) => any;
export = finallyAll;
