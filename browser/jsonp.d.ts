/**
 * @overview jsonp
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 *
 * @example
var data = {};
jsonp({url: 'http://localhost:80/api/metrics', data }).then((response) => {
    window.DEVELOPMENT && console.log('response', response);
    instance.response = response;
    instance.loading = true;
},() => {
    instance.error = true;
    instance.loading = true;
})
*/

import {
  CancelablePromise,
  IScriptOptions,
} from "../global";

import * as script from './script';

declare const jsonp: (url: IScriptOptions | string, options?: IScriptOptions) => CancelablePromise<any>;
export = jsonp;
