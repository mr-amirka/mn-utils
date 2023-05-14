/**
 * @overview Storage
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 */

export interface IStorage {
  set: (key: string, value: any) => IStorage;
  get: (key: string) => any;
  remove: (key: string) => IStorage;
  getKeys: () => string[];
  clear: () => IStorage;
  on: (watcher: (value: any) => any) => void;
}
