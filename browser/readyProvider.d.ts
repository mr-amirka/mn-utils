/**
 * @overview readyProvider
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 *
 */
import {
  fn,
} from "mn-utils";

declare namespace readyProvider {
  export interface watcher {
    fn: fn;
    args?: any[];
    ctx?: any
  }
  export interface node {
    watcher?: watcher | null,
    next?: node
  }
  export interface ready {
    (fn: fn, args?: any[], ctx?: any): (() => void);
  }
}
declare const readyProvider: (w: Window) => readyProvider.ready;
export = readyProvider;
