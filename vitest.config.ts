/// <reference types="vitest/config" />

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import { defineConfig } from 'vitest/config';

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  test: {
    coverage: {
      include: ['packages/*/src/**/*.{ts,tsx}'],
      exclude: [
        '**/*.spec.{ts,tsx}',
        '**/*.stories.tsx',
        '**/stories/test/**',
        '**/index.ts',
        '**/types.ts',
        '**/constants.ts',
        '**/colors.ts',
        '**/*.d.ts',
      ],
      provider: 'v8',
      thresholds: {
        branches: 100,
        functions: 100,
        lines: 100,
        statements: 100,
      },
    },
    resolveSnapshotPath: (testPath, snapExtension) =>
      path.join(path.dirname(testPath), 'snapshots', `${path.basename(testPath)}${snapExtension}`),
    projects: [
      {
        extends: true,
        plugins: [
          react(),
          svgr({
            svgrOptions: { ref: true, titleProp: false },
          }),
        ],
        // specs use composeStories() to render actual .stories.tsx modules (Roadmap 1.0.0 Etap
        // 6), which import the same 'storybook-blocks' alias .storybook/main.ts defines
        resolve: {
          alias: {
            'storybook-blocks': path.resolve(dirname, '.storybook/blocks'),
          },
        },
        test: {
          environment: 'jsdom',
          exclude: ['**/node_modules/**', '**/dist/**'],
          globals: true,
          name: 'unit',
          server: {
            // storybook-addon-code-editor@6.2.0 ships dist/*.js with extensionless relative
            // imports (e.g. `from './createStore'`) — invalid under Node's own ESM resolver, which
            // is what externalized deps go through by default. Inlining forces Vite to transform
            // it instead, the same way the real-browser `storybook` project's bundler already does
            // (that's why only this project hit "Cannot find module .../createStore").
            deps: { inline: ['storybook-addon-code-editor'] },
          },
          setupFiles: ['./test/setup.ts'],
        },
      },
      {
        extends: true,
        // pre-bundles what Vite would otherwise only discover once the first browser test file
        // actually imports it — that late discovery forces a dependency-optimizer reload mid-run
        // ("Vite unexpectedly reloaded a test"), which aborts whichever story files were still
        // being collected when it happened. Listing them up front avoids the reload entirely.
        optimizeDeps: { include: ['react/jsx-dev-runtime', 'react-dom/client'] },
        plugins: [
          // delegates entirely to .storybook/main.ts's own Vite config (svgr, postcss) to render
          // each story — no need to redeclare react()/svgr() here
          storybookTest({ configDir: path.join(dirname, '.storybook') }),
        ],
        test: {
          browser: {
            enabled: true,
            headless: true,
            instances: [{ browser: 'chromium' }],
            provider: 'playwright',
          },
          name: 'storybook',
        },
      },
    ],
  },
});
