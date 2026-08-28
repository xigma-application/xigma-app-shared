import { DocsContainer, type DocsContainerProps } from '@storybook/addon-docs/blocks';
import { FC, PropsWithChildren, useEffect, useState } from 'react';
import { themes } from 'storybook/theming';

// addon-docs' own chrome (Docs page background, headings, ArgsTable, source blocks) has its own
// theme separate from @xigma/scss's [data-theme] our stories use — by default it's always light,
// regardless of the addon-themes toolbar switcher. This mirrors withThemeByDataAttribute's own
// state (data-theme on <html>) so the Docs page's native UI actually follows the same toggle,
// instead of only the embedded story canvas inside it doing so.
const getIsDark = (): boolean => document.documentElement.dataset.theme !== 'light';

export const ReactiveDocsContainer: FC<PropsWithChildren<DocsContainerProps>> = ({ children, ...props }) => {
  const [isDark, setIsDark] = useState(getIsDark);

  useEffect(() => {
    const handleThemeAttributeChange = (): void => setIsDark(getIsDark());
    const observer = new MutationObserver(handleThemeAttributeChange);

    observer.observe(document.documentElement, { attributeFilter: ['data-theme'], attributes: true });

    return (): void => observer.disconnect();
  }, []);

  return (
    <DocsContainer {...props} theme={isDark ? themes.dark : themes.light}>
      {children}
    </DocsContainer>
  );
};

export default ReactiveDocsContainer;
