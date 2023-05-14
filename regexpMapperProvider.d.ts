/**
 * @overview regexpMapperProvider
 * @example
 * const mapper = regexpMapperProvider(/^([^\]*)\/([^\]*)$/g, [ 'begin', 'end' ]);
 * var params = {};
 * if (mapper('users/id6574334245', params)) {
 *   console.log(params); // =>
 *   {
 *      begin: 'users',
 *      end: 'id6574334245'
 *   }
 *   return true;
 * }
 * return false;
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 */

declare namespace regexpMapperProvider {
  export interface regexpMapper {
      (text: string, dst?: any): boolean;
  }
  export interface regexpMapperProvider {
    (regexp: RegExp, keys: string[]): regexpMapper;
  }
}
declare const regexpMapperProvider: regexpMapperProvider.regexpMapperProvider;
export = regexpMapperProvider;
