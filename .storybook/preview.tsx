import type { Preview } from '@storybook/react-vite';

import { withThemeByDataAttribute } from '@storybook/addon-themes';

import { TooltipProvider } from '../packages/core/src/TooltipProvider/TooltipProvider';

import './styles/index.scss';

const preview: Preview = {
  parameters: {
    a11y: {
      // turns an axe-core violation into a hard fail once stories run as tests (Roadmap 1.0.0
      // Etap 4, addon-vitest) — in the interactive Accessibility panel it just controls styling
      test: 'error',
      // .storybook/blocks/StoryBlockCode's syntax-highlight palette fails color-contrast against
      // its #444444 background (confirmed by a real Chromium run, not a jsdom false positive) —
      // it's Storybook-only documentation chrome, never shipped in @xigma/components, so it's
      // scoped out here rather than left to fail every gallery/API story that renders a code
      // block. Tracked as a real, unfixed finding in docs/ROADMAP.1.0.0.md — the palette itself
      // still needs fixing, this only keeps it from blocking the rest of the a11y gate meanwhile.
      context: { exclude: ['[class*="StoryBlockCode"]'] },
    },
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
