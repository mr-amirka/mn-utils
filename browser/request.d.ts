/**
 * @overview request
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 */


import { UrlOptions } from 'mn-utils/url-parse';
import * as Deal from './CancelablePromise';

declare namespace request {
  export interface RequestOptions extends UrlOptions {
    tryLimit?: number;
    tryDelay?: number;
    timeout?: number;
    body?: any;
    method?: string;
    type?: string;
    responseType?: string;
    headers?: {[name: string]: string}
  }
  export interface Request {
    (url: UrlOptions | string, options?: RequestOptions): Deal;
    base: (options: RequestOptions) => Deal;
  }
}
declare const request: request.Request;
export = request;
