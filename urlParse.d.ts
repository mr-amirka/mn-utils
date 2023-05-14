/**
 * @overview urlParse
 * - парсит URL
 *
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 */

import {IUrlOptions} from "./global";

declare function urlParse(href: string): IUrlOptions;
export = urlParse;
