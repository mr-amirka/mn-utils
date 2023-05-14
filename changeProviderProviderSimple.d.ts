/**
 * @overview changeProviderProvider
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 */

/**
 * @example
 * ```js
 * const changeProviderSimple = changeProviderProviderSimple(setState);
 * const handleChange = changeProviderSimple('name');
 * <input onChange={handleChange}/>
 * ```
 */

type IHandleChangeSimple = (e: Event) => any;
type IHandleChangeProviderSimple = (stateFieldName: string) => IHandleChangeSimple;
declare function changeProviderProviderSimple(setState: (state: {[name: string]: any}) => any): IHandleChangeProviderSimple;
export = changeProviderProviderSimple;
