import type { Preview } from '@storybook/react-vite';

import { withThemeByDataAttribute } from '@storybook/addon-themes';

import './styles/index.scss';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
  decorators: [
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
