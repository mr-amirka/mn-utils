/**
 * @overview urlExtend
 * - парсит и мерджит url
 *
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 */

import {IUrlOptions} from "./global";

export declare function urlExtend(
  dst: string | IUrlOptions,
  src: string | IUrlOptions,
): IUrlOptions;
