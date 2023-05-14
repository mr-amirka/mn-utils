/**
 * @overview get
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 */

interface IGet {
  (ctx: any, path: string, def?: any): any;

  /**
   *  Создает getter для извлечения значения
   *  Например:
   *  var person = {
   *    parent: {
   *      name: 'Volodya',
   *      age: 100500
   *    },
   *    name: "Vasya"
   *  };
   *  var getParentName = get.getter('parent.name');
   *  getParentName(person) // => 'Volodya'
   *
   *  var getParentAge = get.getter([ 'parent', 'age' ]);
   *  getParentAge(person) // => 100500
   *
   *  var getName = get.getter(v => v.name);
   *  getName(person) // => "Vasya"
   *
   *  var getByNull = get.getter(null);
   *  getByNull(person) // => person
   *
   */
  readonly getter: (path: any) => (v: any) => any;
  readonly base: (ctx: any, path: string[], def?: any) => any;
}

declare const get: IGet;
export = get;
