/**
 * @overview escapedHalfProvider
 * Возвращает функцию, которая разбивает строку на две части в том месте,
 * где находит разделяющую подстроку separator.
 * Игнорирует разделилель, если он экранрован слэшем (\)
 *
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 *
 */

interface IEscapedHalf {
  (input: string): [string, string, string];
  base: (input: string) => [string, string, string];
}

declare function escapedHalfProvider(separator: string | RegExp): IEscapedHalf;
export = escapedHalfProvider;
