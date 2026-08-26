import cx from 'classnames';

// others
import { HtmlCode } from '../constants';

// types
import { TComponentAttributes, TProps } from '../types';

// utils
import { getHTMLElement } from './common';

const parseAttributesToHTML = (attributes: Array<TComponentAttributes>, styles: Record<string, string>): string => {
  const context = attributes
    .map(
      ({ name, value }) =>
        ` ${getHTMLElement(cx(styles['StoryBlockCode__attribute--name']), name)}${
          value ? `="${getHTMLElement(cx(styles['StoryBlockCode__attribute--value']), value)}"` : ''
        }`,
    )
    .join('');

  return getHTMLElement(cx(styles['StoryBlockCode__attribute']), context);
};

export const parseComponentToHTMLContext = (
  { attributes = [], children }: TProps,
  componentName = '',
  styles: Record<string, string>,
): string => {
  const parsedComponent = getHTMLElement(cx(styles['StoryBlockCode__component-name']), componentName);
  const parsedAttributes = parseAttributesToHTML(attributes, styles);

  if (children) {
    let parsedChildren = '';

    if (Array.isArray(children)) {
      parsedChildren = `${children
        .map(({ componentName, props }) => {
          if (props) {
            return props
              .map((props) =>
                getHTMLElement(
                  cx(styles['StoryBlockCode__children']),
                  parseComponentToHTMLContext(props, componentName, styles),
                  'div',
                ),
              )
              .join('');
          }

          return getHTMLElement(
            cx(styles['StoryBlockCode__children']),
            parseComponentToHTMLContext({}, componentName, styles),
            'div',
          );
        })
        .join('')}`;
    }

    return `${HtmlCode['<']}${parsedComponent}${parsedAttributes}${
      HtmlCode['>']
    }${parsedChildren ? parsedChildren : children}${HtmlCode['<']}/${parsedComponent}${HtmlCode['>']}`;
  }

  return `${HtmlCode['<']}${parsedComponent}${parsedAttributes} /${HtmlCode['>']}`;
};
