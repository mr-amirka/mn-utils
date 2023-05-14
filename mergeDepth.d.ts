/**
 * @overview mergeDepth
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 */

/**
 * Объединяет массив значений в одно значение до заданной глубины
 * @param mergingSrc {any} - значение или массив значений, которые нужно смерджить в один
 * @param dst {any} - объект, в который осуществляется мердж или значение по умолчанию
 * @param depth {number|undefined} - глубина мерджа для вложенных объектов
 * Возвращает смердженный объект
 *
 * @return {any}
 *
 * @example:
 * var obj1 = {name: 'Vasya'};
 * var obj2 = {age: 10, height: 170};
 * var dst = mergeDepth([ obj1, obj2 ]);
 *
 * или
 *
 * var dst = {};
 * mergeDepth([ obj1, obj2 ], dst);
 */
declare const mergeDepth: (mergingSrc: any, dst: any, depth?: number) => any;
export = mergeDepth;
