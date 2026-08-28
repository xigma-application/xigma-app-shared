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
        test: {
          environment: 'jsdom',
          exclude: ['**/node_modules/**', '**/dist/**'],
          globals: true,
          name: 'unit',
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
