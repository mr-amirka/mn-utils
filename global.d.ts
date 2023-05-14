
export interface IFlagsMap {
  [name: string]: number;
}

  /**
   * @description
   * any function
   */
export type fn = (...args: any[]) => any;

  /**
   * @description
   * The function, the call of which canceled the subscription to an event or execute destructor
   */
export type cancel = fn;

  /**
   * @description
   * It execute functions array
   */
export type eachApply = (funcs: fn[] | {[key: string]: fn}, args?: any[], context?: any) => any;

  /**
   * @description
   * Performs defer function execution
   */
export type defer = (callback: fn) => cancel;

export interface IUrlOptions {
  href?: string;
  search?: string;
  unhash?: string;
  hash?: string;
  query?: any;
  protocol?: string;
  path?: string;
  hostname?: string;
  host?: string;
  port?: string;
  unalias?: string;
  dirname?: string;
  filename?: string;
  alias?: string;
  unextension?: string;
  extension?: string;
  unsearch?: string;
  userpart?: string;
  username?: string;
  password?: string;
  email?: string;
  child?: IUrlOptions;
}

export interface ICssPropertiesStringify {
  (props: ICssProps): string;
  prefixedAttrs?: IFlagsMap;
  prefixes?: IFlagsMap;
}
export interface ICssProps {
  [propName: string]: string | string[];
}

export interface IThenable <R> {
  then <U>(
      onFulfilled?: (value: R) => U | IThenable<U>,
      onRejected?: (error: any) => U | IThenable<U>,
  ): IThenable<U>;
}

export type OnReject<U> = (error?: any) => U | IThenable<U>;
export type OnResolve<T, U> = (subject?: T) => U | IThenable<U>;
export type OnFinally<T> = (error?: any, subject?: T) => any;
export type Executor<T> = <T>(
  resolve: (subject?: T | IThenable<T>) => void,
  reject: (error?: any) => void,
) => cancel | any;

/**
 * @desctiption
 * Cancelable promise <br/>
 * This require consumer. <br/>
 * For execution must be called one of the methods: then, catch, finally, onCancel <br/>
 * Has link counter.
 * @example
 * ```js
 * // this require consumer
 * const cancelablePromise1 = new CancelablePromise((resolve) => {
 *   // here code never executed because no consumer
 *   // ...
 * });
 * const cancelablePromise2 = new CancelablePromise((resolve) => {
 *   // here code will be executed because method "then" is called
 *   // ...
 * }).then();
 * ```
 * @example
 * ```js
 * // with cancel
 * const cancelablePromise = new CancelablePromise((resolve) => {
 *   let timeoutId = setTimeout(() => {
 *     resolve(10);
 *   }, 1000);
 *   return () => {
 *     // executed if cancel
 *     if (timeoutId) {
 *       clearTimeout(timeoutId);
 *       timeoutId = null;
 *     }
 *   };
 * });
 * const childCancelablePromise = cancelablePromise
 *     .then((val) => {
 *       // never be executed
 *       console.log(val)
 *     })
 *     .onCancel(() => {
 *       // be executed if cancel
 *       console.log('canceled')
 *     });
 * childCancelablePromise.cancel();
 * ```
 * @example
 * ```js
 * // with custom deferApply
 * const defer = (callback) => {
 *   let timeoutId = setTimeout(callback, 0);
 *   return () => {
 *     // executed if cancel
 *     if (timeoutId) {
 *       clearTimeout(timeoutId);
 *       timeoutId = null;
 *     }
 *   };
 * };
 * const cancelablePromise = new CancelablePromise((resolve) => {
 *   //...
 *   return function onCancel() {
 *     //...
 *   }
 * }, defer);
 * ```
 * @example
 * ```js
 * // call 'then' with string as path
 * const cancelablePromise = CancelablePromise.resolve({
 *   persons: [
 *     {name: 'Vasya', age: 40, child: {name: 'Volodya', age: 20}},
 *     {name: 'Kate', age: 30, child: {name: 'Ann', age: 12}},
 *   ]
 * });
 * cancelablePromise
 *   .then('persons.1.child')
 *   .then((child) => console.log(child)); //=> {name: 'Ann', age: 12}
 * ```
 * @example
 * ```js
 * //cancelable request
 * function simpleRequest(method, url, body) {
 *   return new CancelablePromise((resolve, reject) => {
 *     const xhr = XMLHttpRequest();
 *     xhr.open(method, url, true);
 *     xhr.onload = () => {
 *       const status = xhr.status;
 *       if (status > 199 && status < 400) return resolve(xhr.response);
 *       reject(new Error('status ' + status));
 *     };
 *     xhr.onerror = reject;
 *     xhr.send(body);
 *     return () => {
 *       // be executed if cancel
 *       xhr.abort();
 *     };
 *   });
 * }
 * ```
 */
export declare class CancelablePromise<T> implements IThenable<T> {
  public static resolve<U>(subject?: U | IThenable<U>): CancelablePromise<U>;
  public static reject<U>(subject?: any): CancelablePromise<U>;
  public static all(CancelablePromises: any[] | {[name: string]: any}):
      CancelablePromise<any[] | {[name: string]: any}>;
  public static race<U>(CancelablePromises: (U | IThenable<U>)[] | {[name: string]: U | IThenable<U>}):
      CancelablePromise<U>;
  public static defer<U>(callback?: (...args: any[]) => U): CancelablePromise<U>;
  public static delay<U>(delay?: number, subject?: U): CancelablePromise<U>;
  public static provide<U>(executor?: Executor<U>): CancelablePromise<U>;
  public constructor(executor?: Executor<T>);
  public then<U>(onResolve?: OnResolve<T, U> | string, onReject?: OnReject<U> | string, onCancel?: fn):
      CancelablePromise<U>;
  public catch<U>(onReject?: OnReject<U> | string, onCancel?: fn): CancelablePromise<U>;
  public finally(onFinally?: OnFinally<T>): CancelablePromise<T>;
  public onCancel(callback?: fn): CancelablePromise<T>;
  public cancel(): void;
  public resolve(subject?: T): cancel;
  public reject(subject?: any): cancel;
  public promisify(func: fn): CancelablePromise<T>;
}


export interface IScriptOptions extends IUrlOptions {
  attrs?: {
    [name: string]: string,
  };
}
export interface IScript {
  (url: IUrlOptions | string, options?: IScriptOptions): CancelablePromise<any>;
  base: (options: IScriptOptions) => CancelablePromise<any>;
}

export interface IEmit {
  ((value: any) => void): any;
}

export type ObservableWatcher<T> = <T>(value: T) => any;
export type ObservableExecutor<T> = (
  emit?: IEmit;
  getValue?: () => any;
  on?: ((watcher: ObservableWatcher<T>) => cancel);
) => cancel | any;

export declare class Observable<T> {
  public constructor(defaultValue?: T);
  public constructor(executor?: ObservableExecutor<T> | Observable<T> | IThenable<T>, defaultValue?: T);

  public on(watcher: ObservableWatcher<T>): cancel;
  public emit(value: T | IThenable<T>): void;
  public getValue(): T;

  public static provider<A>(defaultValue?: A): Observable<A>;
  public static provider<A>(executor?: ObservableExecutor<A> | Observable<A> | IThenable<A>, defaultValue?: A): Observable<A>;
  public static wrap<A, B>(fn: (...args: A, cb: (value: B) => any) => cancel): ((...args: A) => Observable<B>);
  public static combine(values: (Observable<any> | any)[] | {[name: string]: Observable<any> | any}): Observable<any>;
  public static some(values: (Observable<any> | any)[]): Observable<any>;
  public static isObservable(value: any): boolean;
}
