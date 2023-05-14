/**
 * @overview mapperProvider
 * @example
 * const mapper = mapperProvider([ 'name', 'age']);
 * mapper([ 'Вася', 30 ]) //=> {name: 'Вася', age: 30}
 *
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 */

declare const mapperProvider: (keys: string[]) => ((values: string[], dst?: any) => {[name: string]: string});
export = mapperProvider;
