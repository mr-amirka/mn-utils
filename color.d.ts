/**
 * @overview color
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 */

interface IColor {
  (input: string): string[];
  base: (args: string[]) => number[];
  normalize: (input: string) => number[];
  get: IGetColor;
  prepare: (args: Array<string | number[]>) => number[][];
  join: IColorJoin;
  rgba: (rgbaColor: number[]) => string;
  rgbaAlt: (rgbaColor: number[]) => string[];
}
interface IGetColor {
  (input: string): number[];
  base: (args: string[]) => number[];
}
interface IColorJoin {
  (args: Array<string | number[]>): string;
  base: (args: number[][]) => number[];
}

declare const color: IColor;
export = color;
