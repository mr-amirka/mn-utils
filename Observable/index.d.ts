/**
 * @overview Observable
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 * @description
 * альтернатива rxjs
 */

import {
  Observable,
} from "../global";


declare function emitterProvider<T>(
  initial?: ObservableExecutor<T> | T,
  defaultInitial?: T,
): Observable<any>;
export = emitterProvider;
