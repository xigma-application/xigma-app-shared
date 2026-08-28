import type { Preview } from '@storybook/react-vite';

import { withThemeByDataAttribute } from '@storybook/addon-themes';

import { TooltipProvider } from '../packages/core/src/TooltipProvider/TooltipProvider';

import './styles/index.scss';

const preview: Preview = {
  parameters: {
    // logs any arg named onXxx to the Actions panel, even when it isn't explicitly wired with
    // `fn()` from `storybook/test` — a safety net for components that gain callback props later
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
  decorators: [
    (Story) => (
      <TooltipProvider>
        <Story />
      </TooltipProvider>
    ),
    withThemeByDataAttribute({
      themes: {
        dark: 'dark',
        light: 'light',
      },
      defaultTheme: 'dark',
      attributeName: 'data-theme',
    }),
  ],
};

export default preview;
