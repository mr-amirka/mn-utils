/**
 * @overview half
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 */

import {fn} from "./global";

/**
 * @description
 * Divides the string in half using separator substring.
 *
 * @example
 * ```js
 * half('/home#team', '#'); // => ['/home', 'team', '#']
 * half('/home#team#contacts', '#'); // => ['/home', 'team#contacts', '#']
 * half('/home', '#'); // => ['/home', '', '']
 * half('/home', '#', true); // => ['', '/home', '']
 * half('/home#', '#'); // => ['/home', '', '#']
 * half('/home#', '#', true); // => ['/home', '', '#']
 * half('#team', '#'); // => ['', 'team', '#']
 * half('#team', '#', true); // => ['', 'team', '#']
 * half('/home?team#contacts', '?'); // => ['/home', 'team#contacts', '?']
 *
 * half.last('/home#team', '#'); // => ['/home', 'team', '#']
 * half.last('/home#team#contacts', '#'); // => ['/home#team', 'contacts', '#']
 * half.last('/home', '#'); // => ['/home', '', '']
 * half.last('/home', '#', true); // => ['', '/home', '']
 * half.last('/home#', '#'); // => ['/home', '', '#']
 * half.last('/home#', '#', true); // => ['/home', '', '#']
 * half.last('#team', '#'); // => ['', 'team', '#']
 * half.last('#team', '#', true); // => ['', 'team', '#']
 * ```
 */
interface IHalf {
  (input: string, separator: string, defaultToRight?: boolean): [string, string, string];
  last: (input: string, separator: string, defaultToRight?: boolean) => [string, string, string];
  provider: (indexOf: fn) => (input: string, separator: string, right?: boolean) => [string, string, string];
}
declare const half: IHalf;
export = half;
