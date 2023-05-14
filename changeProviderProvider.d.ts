/**
 * @overview changeProviderProvider
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 */

/**
 * @example
 * ```js
 * const changeProvider = changeProviderProvider(setState);
 * const handleChange = changeProvider('name', 'value.name');
 * <input onChange={handleChange}/>
 * ```
 */

type IHandleChange = (e: Event) => any;
type IHandleChangeProvider = (
  stateFieldName: string,
  inValuePath?: string | nummer | undefined | null,
  mapHandle?: ((v: any) => any) | undefined | null,
) => IHandleChange;
declare function changeProviderProvider(setState: (state: {[name: string]: any}) => any): IHandleChangeProvider;
export = changeProviderProvider;
