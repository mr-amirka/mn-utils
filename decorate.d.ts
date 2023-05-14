/**
 * @overview decorate
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 *
 */

/*
@example
const wrappedFn = decorate(innerFn);
wrappedFn.use((innerFn) => (args) => {
  console.log('dynamic log: ', args);
  return innerFn(args)
});
*/

import {fn} from "./global";

type IEmit = (v: any) => void;
type IDecorator = (emit: IEmit) => IEmit;
type IEmitWithUse = IEmit & {use: (Emit) => IEmitWithUse};

declare function decorate(emit: IEmit, decorators: IDecorator[]): IEmitWithUse;
export = decorate;
