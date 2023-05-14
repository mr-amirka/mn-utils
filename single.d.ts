/**
 * @overview single
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 */

import {fn} from "./global";

/**
 * @description
 * Декорирует вызов асинхронной функции таким образом,
 * чтобы при каждом следующем вызове,
 * предыдущее асинхронное выполнение отменялось
 * Оборачиваемая функция должна возврвщать колбэк функцию для отмены
 * асинхронного процесса или отменяемый Promise (CancelablePromise)
 * @param {function} fn
 * @return {object}
 */
declare function single(fn: fn): fn;
export = single;
