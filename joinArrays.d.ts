/**
 * @overview joinArrays
 * @example
 *
 * joinArrays(['Володя', 'Вася'], ['стоит', 'бежит'], ' ', []); // =>
 * [
 * 	'Володя стоит', 'Вася стоит', 'Володя бежит', 'Вася бежит'
 * ]
 *
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 */

declare const joinArrays: (prefixes: string[], suffixes: string[], separator?: string, output?: string[]) => string[];
export = joinArrays;
