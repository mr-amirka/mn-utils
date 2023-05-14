/**
 * @overview blobToBase64Url
 *
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 */

declare const blobToBase64Url: (blob: Blob) => CancelablePromise<string>;
export = blobToBase64Url;
