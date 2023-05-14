/**
 * @overview cssPropertiesStringifyProvider
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 */

import {ICssPropertiesStringify, IFlagsMap} from "./global";

declare function cssPropertiesStringifyProvider(
  prefixedAttrs?: IFlagsMap,
  prefixes?: IFlagsMap,
): ICssPropertiesStringify;
export = cssPropertiesStringifyProvider;
