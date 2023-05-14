/**
 * @overview flagsSet
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 *
 * @example
 * flagsSet([ 'apple', 'ban', 'test.use' ]); // =>
 * {
 *   apple: 1,
 *   ban: 1,
 *   test: {
 *     use: 1
 *   }
 * }
 *
 */

import {IFlagsMap} from "./global";

declare const flags: (flags: string[], dst?: any) => IFlagsMap;
export = flags;
