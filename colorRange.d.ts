/**
 * @overview colorRange
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 */

/**
 * @example
 * rangeColors(['#F00', '#0F0', '#00F'], 4); //=> ['#F00', '#0F0', '#0F0', '#00F']
 */

type IColor = string | number[];
declare function colorRange(colors: IColor[], precision?: number): string[];
export = colorRange;
