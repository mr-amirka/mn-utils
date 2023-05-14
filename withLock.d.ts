/**
 * @overview withLock
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 */

declare function withLock<A>(fn: (...args: any[]) => any, result: A): A;
export = withLock;
