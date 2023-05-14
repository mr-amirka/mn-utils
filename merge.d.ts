/**
 * @overview merge
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 */

/**
 * Объединяет массив значений в одно значение
 * @param mergingSrc {any} - значение или массив значений, которые нужно смерджить в один
 * @param dst {any} - объект, в который осуществляется мердж или значение по умолчанию
 * Возвращает смердженный объект
 *
 * @return {any}
 *
 * @example:
 * var obj1 = {name: 'Vasya'};
 * var obj2 = {age: 10, height: 170};
 * var dst = merge([ obj1, obj2 ]);
 *
 * или
 *
 * var dst = {};
 * merge([ obj1, obj2 ], dst);
 */
declare const merge: (mergingSrc: any, dst: any) => any;
export = merge;
