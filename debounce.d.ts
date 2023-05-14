/**
 * @overview debounce
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 */

import {fn} from "./global";

declare function debounce(fn: fn, delay: number): fn;
export = debounce;
