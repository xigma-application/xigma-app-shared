export const getHTMLElement = (className: string, context?: string, htmlElement: 'span' | 'div' = 'span'): string =>
  `<${htmlElement} class="${className}">${context}</${htmlElement}>`;
