/**
 * @overview styleProvider
 * - предоставляет хранилище стилей
 *
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 */

interface Style {
  priority?: number;
  name?: string;
  content?: string;
  revision?: number;
}
type StylesRender = (styles: Style[]) => void;

declare const stylesRenderProvider: (document: Document, prefix?: string) => StylesRender;
export = stylesRenderProvider;
