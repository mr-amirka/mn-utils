/**
 * @overview css-parse
 * - быстро парсит CSS без учета спец.символов внутри ковычек.
 * @author Absalyamov Amir <mr.amirka@ya.ru>
 */
import {ICssProps} from "./global";

declare function cssPropertiesParseSimple(input: string, output?: ICssProps): ICssProps;
export = cssPropertiesParseSimple;
