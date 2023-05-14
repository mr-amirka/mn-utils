/**
 * @overview destroyProvider
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 */

import { fn } from "./global";

declare namespace destroyProvider {
  export interface destroyProvider {
    (..._destroyers: any[]): destroy;
  }
  export interface destroy {
    (...args: any[]): destroy;
    add: (fn?: fn) => destroy;
  }
}

declare const destroyProvider: destroyProvider.destroyProvider;
export = destroyProvider;
