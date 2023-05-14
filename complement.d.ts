/**
 * @overview complement
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 */

 /**
  * Расширяет целевой объект полями другого объекта до указанной глубины, но не заменяет поля,
  * которые уже заполнены скалярными значениями
  *
  * Более эффективный способ глубокого объединения объектов, ибо так производится меньше копирований,
  * чем при обычном глубоком копировании
  * @example
  * complement({
  *    name: "Vasya"
  * }, {
  *    name: "Volodya",
  *    age: 30
  * }) // => {name: "Vasya", age: 30}
  *
  */
interface IComplement {
  (dst?: any, src?: any, depth?: number): any;
  readonly base: (dst: any, src: any, depth: number) => any;
}
declare const complement: IComplement;
export = complement;
