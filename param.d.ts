/**
 * @overview param
 * - конструктор GET парметров url
 *
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 */

declare namespace param {
  export interface param {
    (v: any, excludePrefix?: string): string;
    escape: (v: string) => string;
  }
}
declare const param: param.param;
export = param;
