/**
 * @overview extendDepth
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 */

interface IExtendDepth {
  (dst: any, src: any, depth?: number): any;
  readonly base: (dst: any, src: any, depth: number) => any;
}
declare const extendDepth: IExtendDepth;
export = extendDepth;
