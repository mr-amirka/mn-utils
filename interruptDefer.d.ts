/**
 * @overview interruptDefer
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 * @description
 * Функция может использоваться внутри отменяемых Promise на случай
 * необходимости прерывания асинхронного процесса внутри воркера.
 * Когда возникает необходимость прервать долгий процесс внутри воркеры,
 * требуется, чтобы воркер перешел на следующую итерацию цикла событий
 * и обработал внешние сообщения.
 */

import {fn} from "./global";

declare function interruptDefer(fn: fn | null, args?: any[], ctx?: any): fn;
export = interruptDefer;
