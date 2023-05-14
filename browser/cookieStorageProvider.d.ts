/**
 * @overview cookieStorageProvider
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 *
 */

import {IStorage} from "./storage";

declare const cookieStorageProvider: (win: Window) => IStorage;
export = cookieStorageProvider;
