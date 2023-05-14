/**
 * @overview withResult
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 */

declare function withResult<A>(fn: (...args: any[]) => any, result: A): A;
export = withResult;
