/**
 * @overview globalNameProvider
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 */

import { fn } from "../global";

declare const globalNameProvider: (scope?: any, prefix?: string) => ((fn: fn, ctx?: any) => string);
export = globalNameProvider;
