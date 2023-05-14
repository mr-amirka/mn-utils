/**
 * @overview set
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 */

declare namespace set {
  export interface set {
    (ctx: any, path: string, value: any): any;
    readonly base: (ctx: any, path: string[], value: any) => any;
  }
}
declare const set: set.set;
export = set;
