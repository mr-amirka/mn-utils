/**
 * @overview withoutEmpty
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 */

interface IWithoutEmpty {
  (data: any, depth?: number): any;
  base: (data: any, depth?: number) => any;
}

declare const withoutEmpty: IWithoutEmpty;
export = withoutEmpty;
