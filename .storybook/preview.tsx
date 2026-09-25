import type { Preview } from '@storybook/react-vite';

import { withThemeByDataAttribute } from '@storybook/addon-themes';

import { ReactiveDocsContainer } from './ReactiveDocsContainer';
import { TooltipProvider } from '../packages/core/src/TooltipProvider/TooltipProvider';

import './styles/index.scss';

const preview: Preview = {
  decorators: [
    (Story) => (
      <TooltipProvider>
        <Story />
      </TooltipProvider>
    ),
    withThemeByDataAttribute({
      attributeName: 'data-theme',
      defaultTheme: 'dark',
      themes: {
        dark: 'dark',
        light: 'light',
      },
    }),
  ],
  parameters: {
    a11y: {
      test: 'error',
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    docs: { container: ReactiveDocsContainer },
  },
  tags: ['autodocs'],
};

export default preview;
