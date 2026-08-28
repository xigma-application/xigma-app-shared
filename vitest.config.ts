/// <reference types="vitest/config" />

import path from 'node:path';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [
    react(),
    svgr({
      svgrOptions: { ref: true, titleProp: false },
    }),
  ],
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
    environment: 'jsdom',
    exclude: ['**/node_modules/**', '**/dist/**'],
    globals: true,
    resolveSnapshotPath: (testPath, snapExtension) =>
      path.join(path.dirname(testPath), 'snapshots', `${path.basename(testPath)}${snapExtension}`),
    setupFiles: ['./test/setup.ts'],
  },
});
