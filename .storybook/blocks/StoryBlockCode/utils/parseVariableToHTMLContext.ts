import cx from 'classnames';

// types
import { TVariable } from '../types';

// utils
import { getHTMLElement } from './common';

export const parseVariableToHTMLContext = (styles: Record<string, string>, { name, type, value }: TVariable): string =>
  [
    getHTMLElement(cx(styles['StoryBlockCode__variables--type']), type),
    getHTMLElement(cx(styles['StoryBlockCode__variables--name']), name),
    getHTMLElement(cx(styles['StoryBlockCode__variables--equal']), '='),
    getHTMLElement(cx(styles['StoryBlockCode__variables--value']), value),
  ].join(' ');
