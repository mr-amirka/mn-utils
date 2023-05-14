/**
 * @overview withDelay
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 */
import {fn} from "./global";

declare function withDelay(fn: fn, delay?: number, result?: any): fn;
export = withDelay;
