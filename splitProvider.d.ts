/**
 * @overview splitProvider
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 */


/**
* @example
* const getPath = splitProvider('.');
* getPath('info.phone') // => [ 'info' , 'phone' ]
*/
declare const splitProvider: (delimeter: string | RegExp) => ((str: string) => string[]);
export = splitProvider;
