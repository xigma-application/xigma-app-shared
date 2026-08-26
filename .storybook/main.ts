import path from 'node:path';
import { fileURLToPath } from 'node:url';

import type { StorybookConfig } from '@storybook/react-vite';

import type { Plugin as PostcssPlugin } from 'postcss';
import { mergeConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// @xigma/scss's mixins (svg-color, disabled) use :global(...) for CSS-Modules consumers
// (xigma-app, x-design). This repo's own .scss files aren't run through CSS Modules, where
// :global() is meaningless syntax browsers ignore — unwrap it instead of forking the mixins.
// Mirrors the equivalent fix in packages/components/tsup.config.ts for the built package.
const stripCssModulesGlobal: PostcssPlugin = {
  postcssPlugin: 'strip-css-modules-global',
  Rule(rule) {
    rule.selector = rule.selector.replace(/:global\(([^)]+)\)/g, '$1');
  },
};

const config: StorybookConfig = {
  stories: ['../packages/*/src/**/*.mdx', '../packages/*/src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: ['@storybook/addon-docs', '@storybook/addon-themes'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  viteFinal: async (config) =>
    mergeConfig(config, {
      plugins: [svgr({ svgrOptions: { ref: true, titleProp: false } })],
      resolve: {
        // Lets any package's stories do `import { StoryApi } from 'storybook-blocks';` instead of
        // a brittle relative path back up to .storybook/blocks — mirrors x-design's own `'stories'`
        // tsconfig-paths alias for the same doc-kit.
        alias: {
          'storybook-blocks': path.resolve(__dirname, 'blocks'),
        },
      },
      css: {
        postcss: {
          plugins: [stripCssModulesGlobal],
        },
      },
    }),
};

export default config;
