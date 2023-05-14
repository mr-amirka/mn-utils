/**
 * @overview escapedSplitProvider
 * Разбивает строку на подстроки с учетом экранирования служебного символа
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 */

interface IEscapedSplit {
  (input: string, dstSeparators?: string[]): string[];
  base: (input: string, dstSeparators?: string[]) => string[];
}

declare function escapedSplitProvider(separator: string | RegExp): IEscapedSplit;
export = escapedSplitProvider;
