/**
 * @overview defer
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 */

import {fn} from "./global";

declare const defer: (fn: fn | null, args?: any, ctx?: any) => fn;
export = defer;
