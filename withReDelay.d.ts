/**
 * @overview withReDelay
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 */

import {fn} from "./global";

declare function withReDelay(fn: fn, delay: number): fn;
export = withReDelay;
