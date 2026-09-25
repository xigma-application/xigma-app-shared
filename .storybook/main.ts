import path from 'node:path';
import { fileURLToPath } from 'node:url';

import type { StorybookConfig } from '@storybook/react-vite';

import type { Plugin as PostcssPlugin } from 'postcss';
import { mergeConfig } from 'vite';
import svgr from 'vite-plugin-svgr';
import { getCodeEditorStaticDirs } from 'storybook-addon-code-editor/getStaticDirs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const stripCssModulesGlobal: PostcssPlugin = {
  Rule(rule) {
    rule.selector = rule.selector.replace(/:global\(([^)]+)\)/g, '$1');
  },
  postcssPlugin: 'strip-css-modules-global',
};

const config: StorybookConfig = {
  addons: [
    '@storybook/addon-docs',
    '@storybook/addon-themes',
    '@storybook/addon-a11y',
    '@storybook/addon-vitest',
    '@storybook/addon-mcp',
    'storybook-addon-tag-badges',
    '@chromatic-com/storybook',
    'storybook-addon-code-editor',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  // Monaco Editor's own assets (for storybook-addon-code-editor's live playground) — served
  // statically, not bundled through Vite
  staticDirs: [...getCodeEditorStaticDirs(__filename)],
  stories: ['../packages/*/src/**/*.mdx', '../packages/*/src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  typescript: {
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      tsconfigPath: path.resolve(__dirname, '../packages/components/tsconfig.json'),
    },
  },
  viteFinal: async (config) =>
    mergeConfig(config, {
      css: {
        postcss: {
          plugins: [stripCssModulesGlobal],
        },
      },
      plugins: [
        svgr({
          svgrOptions: { ref: true, titleProp: false },
        }),
      ],
      resolve: {
        alias: {
          'storybook-blocks': path.resolve(__dirname, 'blocks'),
        },
      },
    }),
};

export default config;
