/**
 * @overview withDefer
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 */
import {fn} from "./global";

declare function withDefer(fn: fn, result?: any): fn;
export = withDefer;
