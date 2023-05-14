/**
 * @overview CancelablePromiseProvider
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 */

import {
  defer,
  CancelablePromise,
} from "./global";

/**
@desctiption
Cancelable promise provider <br/>

@example
```js
// width default options
const CancelablePromise = CancelablePromiseProvider();
const cancelablePromise = new CancelablePromise((resolve) => {
  resolve('Hello!');
});
```
@example
```js
// width custom options
const CancelablePromise = CancelablePromiseProvider({
  defer: defer,
  ParentClass: Promise,
});
const cancelablePromise = new CancelablePromise((resolve) => {
  resolve('Hello!');
});
```
 */
declare function CancelablePromiseProvider<T>({
  defer?: defer,
  ParentClass?: any
}): CancelablePromise<T>;
export = CancelablePromiseProvider;
