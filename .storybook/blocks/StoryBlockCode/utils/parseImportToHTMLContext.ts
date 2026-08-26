import cx from 'classnames';

// types
import { TImport } from '../types';

// utils
import { getHTMLElement } from './common';

const getItemWithHighlightWordAs = (itemsToImports: string, styles: Record<string, string>): string =>
  itemsToImports
    .split(' ')
    .map((item) => (item === 'as' ? getHTMLElement(cx(styles['StoryBlockCode__import-as']), 'as') : item))
    .join(' ');

export const parseImportToHTMLContext = (
  { items: itemsToImports, path }: TImport,
  styles: Record<string, string>,
): string =>
  [
    getHTMLElement(cx(styles['StoryBlockCode__import']), 'import'),
    getHTMLElement(cx(styles['StoryBlockCode__import-items']), getItemWithHighlightWordAs(itemsToImports, styles)),
    getHTMLElement(cx(styles['StoryBlockCode__import-from']), 'from'),
    getHTMLElement(cx(styles['StoryBlockCode__import-path']), `'${path}'`),
    getHTMLElement(cx(styles['StoryBlockCode__import-semicolon']), ';'),
  ].join(' ');
