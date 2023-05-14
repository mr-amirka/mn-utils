/**
 * @overview once
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 */

import { fn } from "./global";

declare const once: (fn: fn | null) => fn;
export = once;
